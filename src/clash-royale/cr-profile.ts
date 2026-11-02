import { writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { Cause, Config, Console, Data, Effect, Exit, Option, Redacted, Schema } from "effect";
import { FetchHttpClient, HttpClient, HttpClientRequest } from "effect/http";

const OFFICIAL_BASE_URL = "https://api.clashroyale.com/v1";
const ROYALEAPI_PROXY_BASE_URL = "https://proxy.royaleapi.dev/v1";
const TOKEN_ENV = "CLASH_ROYALE_API_TOKEN";
const BASE_URL_ENV = "CLASH_ROYALE_API_BASE_URL";
const LOG_PREFIX = "[cr-profile]";
const TAG_PATTERN = /^[0289CGJLPQRUVY]+$/;
const TRAILING_SLASHES = /\/+$/;
const JSON_INDENT = 4;
const REQUEST_TIMEOUT_MS = 15_000;
const MS_PER_SECOND = 1000;
const USER_ARGS_START = 2;
const HTTP_OK_MIN = 200;
const HTTP_OK_MAX = 299;

const EXIT_CODE = {
  ok: 0,
  failure: 1,
  usage: 2,
  partial: 3,
} as const;

const HTTP_HINTS: Readonly<Record<number, string>> = {
  400: "The request was rejected. Check the player tag.",
  403: `Access denied. The token is wrong, expired, or not allowed from this IP. Keys from developer.clashroyale.com are bound to IP addresses: add this machine's public IP, or create a key for the RoyaleAPI proxy IP and set ${BASE_URL_ENV}=${ROYALEAPI_PROXY_BASE_URL}.`,
  404: "Player not found. Check the tag (it uses 0, not O).",
  429: "Rate limited. Wait a moment and try again.",
  500: "The API had an internal error. Try again later.",
  503: "The API is under maintenance. Try again later.",
};

const USAGE = `Usage: node cr-profile.mjs <player-tag> [options]

Fetches a Clash Royale player's profile and battlelog from the official API
and prints them as one JSON object: { "profile": ..., "battlelog": ... }.

Options:
  --only <profile|battlelog>  Fetch only one of the two
  --out <file>                Write the JSON to a file instead of stdout
  --base-url <url>            API base URL (default: ${OFFICIAL_BASE_URL})
  -h, --help                  Show this help

Environment:
  ${TOKEN_ENV}     API token (required), from developer.clashroyale.com
  ${BASE_URL_ENV}  Same as --base-url (e.g. ${ROYALEAPI_PROXY_BASE_URL})`;

const Section = Schema.Literals(["profile", "battlelog"]);
type Section = typeof Section.Type;
const ALL_SECTIONS: readonly Section[] = ["profile", "battlelog"];

const PlayerTag = Schema.String.pipe(Schema.check(Schema.isPattern(TAG_PATTERN)));

const BaseUrl = Schema.String.pipe(Schema.check(Schema.isPattern(/^https?:\/\/\S+$/)));

const ProfileShape = Schema.Struct({ tag: Schema.String, name: Schema.String });

const BattlelogShape = Schema.Array(
  Schema.Struct({ type: Schema.String, battleTime: Schema.String }),
);

const ApiErrorBody = Schema.Struct({ reason: Schema.optional(Schema.String) });

const SECTION_SHAPES = {
  profile: ProfileShape,
  battlelog: BattlelogShape,
} as const;

class UsageError extends Data.TaggedError("UsageError")<{ readonly message: string }> {}

class ApiError extends Data.TaggedError("ApiError")<{
  readonly status: number;
  readonly reason: string;
}> {}

class RequestError extends Data.TaggedError("RequestError")<{ readonly message: string }> {}

class WriteError extends Data.TaggedError("WriteError")<{ readonly message: string }> {}

interface Options {
  readonly tag: string;
  readonly sections: readonly Section[];
  readonly baseUrl: string;
  readonly token: Redacted.Redacted;
  readonly out: string | undefined;
}

/** Normalizes a player tag (uppercase, no leading "#", letter O as 0) and validates it. */
const decodeTag = (rawTag: string) =>
  Schema.decodeUnknownEffect(PlayerTag)(
    rawTag.trim().toUpperCase().replace(/^#/, "").replaceAll("O", "0"),
  ).pipe(
    Effect.mapError(() => new UsageError({ message: `"${rawTag}" is not a valid player tag.` })),
  );

const decodeSections = (only: string | undefined) =>
  only === undefined
    ? Effect.succeed(ALL_SECTIONS)
    : Schema.decodeUnknownEffect(Section)(only).pipe(
        Effect.map((section): readonly Section[] => [section]),
        Effect.mapError(
          () =>
            new UsageError({ message: `--only must be "profile" or "battlelog", got "${only}".` }),
        ),
      );

const decodeBaseUrl = (rawUrl: string) =>
  Schema.decodeUnknownEffect(BaseUrl)(rawUrl.replace(TRAILING_SLASHES, "")).pipe(
    Effect.mapError(() => new UsageError({ message: `"${rawUrl}" is not a valid base URL.` })),
  );

const readArgs = (argv: readonly string[]) =>
  Effect.try({
    try: () =>
      parseArgs({
        args: [...argv],
        allowPositionals: true,
        options: {
          only: { type: "string" },
          out: { type: "string" },
          "base-url": { type: "string" },
          help: { type: "boolean", short: "h" },
        },
      }),
    catch: (cause) => new UsageError({ message: describeUnknown(cause) }),
  });

const readToken = Config.Redacted(TOKEN_ENV).pipe(
  Effect.mapError(
    () =>
      new UsageError({
        message: `Set ${TOKEN_ENV} to an API token from developer.clashroyale.com (keys are tied to your IP).`,
      }),
  ),
);

const readBaseUrlEnv = Config.String(BASE_URL_ENV).pipe(
  Config.option,
  Effect.orElseSucceed(Option.none),
);

/** Parses argv and environment into validated options, or `undefined` when help was requested. */
const loadOptions = Effect.fn("loadOptions")(function* (argv: readonly string[]) {
  const { values, positionals } = yield* readArgs(argv);
  if (values.help) {
    yield* Console.log(USAGE);
    return undefined;
  }

  const [rawTag] = positionals;
  if (rawTag === undefined || positionals.length > 1) {
    return yield* new UsageError({ message: "Pass exactly one player tag." });
  }

  const envBaseUrl = yield* readBaseUrlEnv;
  const options: Options = {
    tag: yield* decodeTag(rawTag),
    sections: yield* decodeSections(values.only),
    baseUrl: yield* decodeBaseUrl(
      values["base-url"] ?? Option.getOrElse(envBaseUrl, () => OFFICIAL_BASE_URL),
    ),
    token: yield* readToken,
    out: values.out,
  };
  return options;
});

const sectionPath = (section: Section, tag: string) => {
  const encodedTag = encodeURIComponent(`#${tag}`);
  return section === "profile" ? `/players/${encodedTag}` : `/players/${encodedTag}/battlelog`;
};

const isOk = (status: number) => status >= HTTP_OK_MIN && status <= HTTP_OK_MAX;

/** Fetches one section, fails with ApiError on non-2xx, and validates the body's shape. */
const fetchSection = Effect.fn("fetchSection")(function* (options: Options, section: Section) {
  const request = HttpClientRequest.get(
    `${options.baseUrl}${sectionPath(section, options.tag)}`,
  ).pipe(
    HttpClientRequest.bearerToken(Redacted.value(options.token)),
    HttpClientRequest.acceptJson,
  );

  const response = yield* HttpClient.execute(request).pipe(
    Effect.timeout(REQUEST_TIMEOUT_MS),
    Effect.mapError((cause) =>
      Cause.isTimeoutError(cause)
        ? new RequestError({
            message: `No response within ${REQUEST_TIMEOUT_MS / MS_PER_SECOND}s. Check your connection.`,
          })
        : new RequestError({ message: cause.message }),
    ),
  );

  const body = yield* response.json.pipe(Effect.orElseSucceed(() => null));

  if (!isOk(response.status)) {
    const errorBody = yield* Schema.decodeUnknownEffect(ApiErrorBody)(body).pipe(
      Effect.orElseSucceed(() => ({ reason: undefined })),
    );
    return yield* new ApiError({ status: response.status, reason: errorBody.reason ?? "" });
  }

  yield* Schema.decodeUnknownEffect(SECTION_SHAPES[section])(body).pipe(
    Effect.mapError(
      () => new RequestError({ message: `The API returned an unexpected ${section} format.` }),
    ),
  );
  return body;
});

function describeUnknown(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}

function describeError(error: ApiError | RequestError): string {
  if (!(error instanceof ApiError)) {
    return error.message;
  }
  const base = `HTTP ${error.status}${error.reason ? ` (${error.reason})` : ""}`;
  const hint = HTTP_HINTS[error.status];
  return hint ? `${base}. ${hint}` : base;
}

const writeOutput = (json: string, out: string | undefined) =>
  out === undefined
    ? Console.log(json)
    : Effect.tryPromise({
        try: () => writeFile(out, `${json}\n`),
        catch: (cause) =>
          new WriteError({ message: `Could not write ${out}: ${describeUnknown(cause)}` }),
      }).pipe(Effect.andThen(Console.error(`${LOG_PREFIX} Wrote ${out}`)));

/** Fetches every requested section concurrently, keeps whatever succeeded, and returns the exit code. */
const run = Effect.fn("run")(function* (options: Options) {
  const exits = yield* Effect.forEach(
    options.sections,
    (section) => Effect.exit(fetchSection(options, section)),
    { concurrency: "unbounded" },
  );

  const output: Partial<Record<Section, unknown>> = {};
  let failures = 0;

  for (const [index, section] of options.sections.entries()) {
    const exit = exits[index];
    if (exit !== undefined && Exit.isSuccess(exit)) {
      output[section] = exit.value;
      continue;
    }
    failures += 1;
    output[section] = null;
    const failure = exit === undefined ? Option.none() : Exit.findErrorOption(exit);
    const reason = Option.match(failure, {
      onNone: () => "unexpected failure",
      onSome: describeError,
    });
    yield* Console.error(`${LOG_PREFIX} ${section} failed: ${reason}`);
  }

  if (failures === options.sections.length) {
    return EXIT_CODE.failure;
  }

  yield* writeOutput(JSON.stringify(output, null, JSON_INDENT), options.out);
  return failures > 0 ? EXIT_CODE.partial : EXIT_CODE.ok;
});

const main = loadOptions(process.argv.slice(USER_ARGS_START)).pipe(
  Effect.flatMap((options) =>
    options === undefined ? Effect.succeed(EXIT_CODE.ok) : run(options),
  ),
  Effect.catchTags({
    UsageError: (error) =>
      Console.error(`${LOG_PREFIX} ${error.message}\n\n${USAGE}`).pipe(Effect.as(EXIT_CODE.usage)),
    WriteError: (error) =>
      Console.error(`${LOG_PREFIX} ${error.message}`).pipe(Effect.as(EXIT_CODE.failure)),
  }),
  Effect.flatMap((code) =>
    Effect.sync(() => {
      process.exitCode = code;
    }),
  ),
  Effect.provide(FetchHttpClient.layer),
);

Effect.runFork(main);
