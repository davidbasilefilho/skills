const PROMISE_METHODS = new Set(["then", "catch", "finally"]);

/**
 * Builds a rule that reports every node a visitor matches with one fixed message.
 * @param {string} description
 * @param {string} message
 * @param {(report: (node: unknown) => void) => Record<string, (node: any) => void>} visitors
 */
const forbid = (description, message, visitors) => ({
  meta: { type: "problem", docs: { description }, messages: { forbidden: message } },
  create: (context) => visitors((node) => context.report({ node, messageId: "forbidden" })),
});

const MODULE_NAMESPACE = /^[A-Z]/;

/** Effect-style module namespaces (Effect.catch, Stream.catch) are PascalCase identifiers. */
const isModuleNamespace = (node) => node.type === "Identifier" && MODULE_NAMESPACE.test(node.name);

const reportAsync = (report) => (node) => {
  if (node.async) {
    report(node);
  }
};

export default {
  meta: { name: "effect-only" },
  rules: {
    "no-try-catch": forbid(
      "Disallow try/catch/finally outside adapters",
      "Use Effect.try or Effect.tryPromise instead of try/catch.",
      (report) => ({ TryStatement: report }),
    ),
    "no-throw": forbid(
      "Disallow throw outside adapters",
      "Fail with an Effect error (yield* new TaggedError(...) or Effect.fail) instead of throw.",
      (report) => ({ ThrowStatement: report }),
    ),
    "no-async-await": forbid(
      "Disallow async functions and await outside adapters",
      "Use Effect.gen / Effect.fn with yield* instead of async/await.",
      (report) => ({
        AwaitExpression: report,
        FunctionDeclaration: reportAsync(report),
        FunctionExpression: reportAsync(report),
        ArrowFunctionExpression: reportAsync(report),
      }),
    ),
    "no-promise-api": forbid(
      "Disallow direct Promise usage outside adapters",
      "Wrap promise-returning code in Effect.tryPromise instead of using the Promise API.",
      (report) => ({
        NewExpression: (node) => {
          if (node.callee.type === "Identifier" && node.callee.name === "Promise") {
            report(node);
          }
        },
        MemberExpression: (node) => {
          if (node.object.type === "Identifier" && node.object.name === "Promise") {
            report(node);
          }
        },
        CallExpression: (node) => {
          const { callee } = node;
          if (
            callee.type === "MemberExpression" &&
            callee.property.type === "Identifier" &&
            PROMISE_METHODS.has(callee.property.name) &&
            !isModuleNamespace(callee.object)
          ) {
            report(node);
          }
        },
      }),
    ),
  },
};
