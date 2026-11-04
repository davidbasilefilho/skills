# Checks

Add these to the project so the rules in `react-prefs` fail CI when broken. The test runs with `bun test` (see `bun-prefs`; if the project uses another runner, port it). Adapt the `src` glob to the project. The scans are heuristics for the common patterns: they catch regressions, they do not replace review.

## Test file: `tests/react-prefs.test.ts`

```ts
import { expect, test } from "bun:test";
import { Glob } from "bun";
import { existsSync, readFileSync } from "node:fs";

const files = [...new Glob("src/**/*.{tsx,jsx}").scanSync(".")];
const read = (f: string) => readFileSync(f, "utf8");
const allowed = (line: string) => line.includes("react-prefs: allow-conditional");

function scan(patterns: RegExp[]): string[] {
  const hits: string[] = [];
  for (const f of files) {
    const lines = read(f).split("\n");
    lines.forEach((line, i) => {
      const prev = lines[i - 1] ?? "";
      if (allowed(line) || allowed(prev)) return;
      if (patterns.some((p) => p.test(line))) hits.push(`${f}:${i + 1}: ${line.trim()}`);
    });
  }
  return hits;
}

test("visibility toggling uses Activity, not conditional rendering", () => {
  const hits = scan([
    /\{\s*!?[\w.?]+(\([^)]*\))?\s*&&\s*\(?\s*</, // {cond && <X />}
    /\?\s*\(?\s*<[^>]*>[^:]*:\s*null\s*\)?\s*\}/, // cond ? <X /> : null
    /\?\s*null\s*:\s*\(?\s*</, // cond ? null : <X />
    /style=\{\{[^}]*display:\s*[^}]*\}\}/, // inline display toggles
  ]);
  expect(hits).toEqual([]);
});

test("React never gets a manual startViewTransition call", () => {
  const hits = scan([/document\.startViewTransition\(/]);
  expect(hits).toEqual([]);
});

test("ViewTransition names are unique", () => {
  const names = new Map<string, string>();
  const dupes: string[] = [];
  for (const f of files) {
    for (const m of read(f).matchAll(/<ViewTransition[^>]*\sname="([^"]+)"/g)) {
      if (names.has(m[1])) dupes.push(`${m[1]} in ${names.get(m[1])} and ${f}`);
      names.set(m[1], f);
    }
  }
  expect(dupes).toEqual([]);
});

test("reduced motion is honored for view transitions", () => {
  const css = [...new Glob("src/**/*.css").scanSync(".")].map(read).join("\n");
  const usesVT = files.some((f) => read(f).includes("<ViewTransition"));
  if (usesVT) expect(css).toMatch(/prefers-reduced-motion/);
});

test("React Compiler is configured (or the project records a waiver)", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  if (pkg["x-react-compiler-waiver"]) return; // reason recorded, re-check on upgrades
  const configs = [...new Glob("{package.json,*.config.*,.babelrc*,app.json}").scanSync(".")]
    .filter((f) => existsSync(f))
    .map(read)
    .join("\n");
  expect(configs).toMatch(/babel-plugin-react-compiler|reactCompiler|reactCompilerPreset|react-compiler/);
});

test("compiler lint rules are enabled and the superseded plugin is gone", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  expect(deps["eslint-plugin-react-compiler"]).toBeUndefined();
  if (pkg["x-react-compiler-waiver"]) return;
  expect(deps["eslint-plugin-react-hooks"]).toBeDefined();
});
```

The Compiler waiver is a `package.json` field, `"x-react-compiler-waiver": "<why the bundler or platform cannot support it>"`, used only when the bundler or platform really cannot support the Compiler.

If the project uses Oxlint instead of ESLint, replace the last test with a check of the Oxlint config for the React Compiler rules (verify the rule names against current docs).

## CI steps

1. `bun test` (includes the file above).
2. The project's lint command with the compiler rules active. It must fail the pipeline on `immutability`, `purity`, `refs`, `set-state-in-render`, `set-state-in-effect` and the other rules of `reactHooks.configs.flat.recommended`.
3. The project's build with the Compiler enabled.

## Manual checks to report

- Open the app and confirm compiled components show the "Memo" badge in React DevTools.
- Toggle every Activity-wrapped region and confirm state (for example a typed draft) survives, and media pauses.
- Navigate and toggle with and without `prefers-reduced-motion` and confirm animations stop when it is set.
