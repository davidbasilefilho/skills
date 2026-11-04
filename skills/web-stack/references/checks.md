# Checks

Add these to the project and run them before reporting work done. Also add the checks from `react-prefs` ([Checks](../../react-prefs/references/checks.md)). The static scans are heuristics for the common patterns: they catch regressions, they do not replace review. Adapt the globs to the project and port to the project's runner if it is not `bun test` (see `bun-prefs`).

## Test file: `tests/web-stack.test.ts`

```ts
import { expect, test } from "bun:test";
import { Glob } from "bun";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const deps: Record<string, string> = { ...pkg.dependencies, ...pkg.devDependencies };
const has = (name: string) => name in deps;
const files = [...new Glob("src/**/*.{ts,tsx}").scanSync(".")];
const read = (f: string) => readFileSync(f, "utf8");
const filesWith = (re: RegExp) => files.filter((f) => re.test(read(f)));

test("Convex does not go through TanStack Query", () => {
  expect(has("@convex-dev/react-query")).toBe(false);
  expect(filesWith(/convexQuery|ConvexQueryClient|useConvexMutation|@convex-dev\/react-query/)).toEqual([]);
});

test("Convex projects use TanStack DB", () => {
  if (!has("convex")) return;
  expect(has("@tanstack/db")).toBe(true);
  expect(has("@tanstack/react-db")).toBe(true);
  expect(has("@tanstack/convex-db-collection")).toBe(true);
});

test("every Convex collection is persisted and renders from local data first", () => {
  for (const f of filesWith(/convexCollectionOptions\(|convexPaginatedCollectionOptions\(/)) {
    const src = read(f);
    expect(src, `${f}: wrap in persistedCollectionOptions`).toMatch(/persistedCollectionOptions\(/);
    expect(src, `${f}: initialRender strategy`).toMatch(/strategy:\s*["']network-first["']/);
    expect(src, `${f}: initialRender timeout`).toMatch(/networkTimeoutMs:\s*0\b/);
    expect(src, `${f}: schemaVersion`).toMatch(/schemaVersion:/);
  }
});

test("shared client state uses TanStack Store, not repeated state", () => {
  // Heuristic: a store is present once any module-level shared state exists.
  const usesCreateStore = filesWith(/createStore\(/).length > 0;
  const usesContextState = filesWith(/createContext\([^)]*\)[\s\S]*useState\(/).length;
  if (usesContextState > 0) expect(usesCreateStore, "move shared state into @tanstack/react-store").toBe(true);
});

test("hand-rolled replacements of TanStack libraries are absent", () => {
  const banned: Record<string, string> = {
    "react-hook-form": "@tanstack/react-form",
    formik: "@tanstack/react-form",
    "react-markdown": "@tanstack/markdown",
    marked: "@tanstack/markdown",
    "markdown-it": "@tanstack/markdown",
    "highlight.js": "@tanstack/highlight",
    prismjs: "@tanstack/highlight",
    "react-window": "@tanstack/react-virtual",
    "react-virtualized": "@tanstack/react-virtual",
    "lodash.debounce": "@tanstack/react-pacer",
    "lodash.throttle": "@tanstack/react-pacer",
    "react-hotkeys-hook": "@tanstack/react-hotkeys",
    "react-router": "@tanstack/react-router",
    "react-router-dom": "@tanstack/react-router",
  };
  const found = Object.keys(banned).filter(has);
  expect(found.map((d) => `${d} -> ${banned[d]}`)).toEqual([]);
  expect(filesWith(/addEventListener\(\s*["']key(down|up)["']/)).toEqual([]); // use Hotkeys
});

test("class merging uses the cn package", () => {
  expect(has("cn")).toBe(true);
  expect(has("tailwind-merge")).toBe(false);
  expect(filesWith(/from ["']tailwind-merge["']/)).toEqual([]);
});

test("Base UI package is the current one", () => {
  expect(has("@base-ui-components/react")).toBe(false);
});

test("Router view transitions use one mechanism per navigation", () => {
  const routerOption = filesWith(/defaultViewTransition|viewTransition\s*[:=]/).length > 0;
  const outletInVT = filesWith(/<ViewTransition[^>]*>\s*<Outlet\b/).length > 0;
  if (has("@tanstack/react-router") || has("@tanstack/react-start")) {
    expect(routerOption || outletInVT, "route changes need a view transition").toBe(true);
    expect(routerOption && outletInVT, "Router option and <ViewTransition> around Outlet both animate").toBe(false);
  }
});
```

The checks allow no exceptions by configuration. When a listed library seems unavoidable, ask the user (structured question tool when available, plain question otherwise) and record the answer in the project's agent instructions file. The TanStack Query rule has no exception for Convex.

If a TanStack library from [TanStack libraries](tanstack-libraries.md) is unconfirmed for the framework and was not adopted, record that in the project docs after checking, and re-check on upgrades.

## Browser check: cached-first load

Run in the project's browser test runner (or with browser automation when available; otherwise give the user the manual steps and ask for the result). Fixture: a signed-in user with seeded Convex rows.

1. Load the page and wait until the rows are shown (first visit, network).
2. Reload the page with the network throttled to slow or offline for the Convex connection.
3. Assert the cached rows are in the DOM before the Convex connection is established, and that no loading indicator or skeleton was shown at any point after navigation start (record DOM snapshots or observe with a mutation observer from page start).
4. Restore the network and assert the rows update from the server without clearing.
5. Sign out, then sign in as a different user, and assert the first user's rows are not shown.

Pass condition: steps 3 to 5 hold. If the persistence-plus-Convex combination is unverified for the installed versions (see [Convex and TanStack DB](convex-and-db.md)), a failing step 3 is reported as a known gap with the reason, never hidden.

## CI steps

1. `bun test` (the file above and the `react-prefs` file).
2. The project's lint, type-check and build commands.
3. The browser check in a pipeline that has a browser.
