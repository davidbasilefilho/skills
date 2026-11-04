# Versioning

Research dated 2026-11-04. The test below was run under Bun 1.4.4 against four fixtures (see the notes after it). **Verify** any other Bun API against https://bun.com/docs before relying on it.

## ZeroVer

ZeroVer (https://0ver.org) keeps the major version at 0. Valid examples from the spec: `0.0.1`, `0.4.0`, `0.9.8n`, `0.0`. Invalid: `1.0`, `1.0.0-rc1`, `2018.04.01`.

The spec is loose. The rule here is stricter: the version is exactly `0.Y.Z` with numeric `Y` and `Z`, matching `^0\.\d+\.\d+$`. Treat that as this repository's choice, not as ZeroVer itself.

Caret ranges in 0.Y.Z follow the left-most non-zero component: `^0.4.0` means `>=0.4.0 <0.5.0`, and `0.0.z` is always breaking. Range format is owned by `bun-prefs`.

## Tests to add

Add this as `tests/versioning.test.ts` (or the project's test directory). It runs under `bun test`. For a project without Bun, port it to the project's test runner and its version file (`Cargo.toml`, `pyproject.toml` and so on); the assertions stay the same.

```ts
import { test, expect } from "bun:test";
import { Glob } from "bun";

const ZERO_VER = /^0\.\d+\.\d+$/;

async function readVersion(path: string): Promise<string> {
  return (await Bun.file(path).json()).version;
}

function parse(v: string): [number, number, number] {
  const [a, b, c] = v.split(".").map(Number);
  return [a, b, c];
}

// strict "greater than" for ZeroVer-style numeric versions
function isGreater(a: string, b: string): boolean {
  const x = parse(a);
  const y = parse(b);
  for (let i = 0; i < 3; i++) {
    if (x[i] !== y[i]) return x[i] > y[i];
  }
  return false;
}

test("every package version is ZeroVer", async () => {
  for await (const p of new Glob("**/package.json").scan({})) {
    if (p.includes("node_modules")) continue;
    const j = await Bun.file(p).json();
    if (j.version !== undefined) expect(j.version, p).toMatch(ZERO_VER);
  }
});

// the sync-back merge of main into dev has origin/main as its second parent
async function isSyncBack(): Promise<boolean> {
  const second = await Bun.$`git rev-parse HEAD^2`.nothrow().quiet().text();
  const main = await Bun.$`git rev-parse origin/main`.text();
  return second.trim() === main.trim();
}

test("version is strictly greater than main", async () => {
  if (process.env.GITHUB_REF_NAME === "main" && process.env.GITHUB_EVENT_NAME === "push") {
    return; // on main itself the versions are equal by definition
  }
  if (await isSyncBack()) {
    return; // dev now holds the released version, equal to main by definition
  }
  const cur = await readVersion("package.json");
  const main = JSON.parse(
    await Bun.$`git show origin/main:package.json`.text(),
  ).version;
  expect(isGreater(cur, main), `${cur} must be greater than main's ${main}`).toBe(true);
});
```

Notes:

- `Glob.scan` has no `ignore` option (Bun 1.4.4 scans `node_modules` anyway), so the loop skips those paths itself. Dependency versions such as `1.2.3` would otherwise fail ZeroVer.
- Fixtures it was run against: main `0.1.0` with the branch at `0.2.0` passes; the branch equal to main fails the greater-than test; a workspace package at `1.0.0` fails the ZeroVer test; a workspace with `apps/`, `packages/` and a `node_modules` dependency at `9.9.9` passes. The sync-back skip was also run: an equal version passes on a merge commit whose second parent is `origin/main` and fails on a later ordinary commit. The skip for pushes to `main` was not exercised.
- The comparison is numeric on purpose: it is correct for ZeroVer and avoids relying on a semver helper. If the project prefers `Bun.semver.order(cur, main)` (returns `1` when the first argument is greater, **unverified**), confirm that in the Bun docs first.
- The skip is limited to pushes to `main` and to the sync-back merge commit that returns `main` to `dev` ([Branches and merging](branches-and-merging.md)), whose version equals main's by design. Pull requests into `dev`, other pushes to `dev` and the `dev` into `main` pull request all run the check. Because the check is skipped on `main` pushes, it cannot catch an unchanged version after the fact: the required status check on pull requests into `dev` and `main` is what guarantees a new version per `main` commit.
- In a monorepo with a single version source (see `bun-prefs`), compare the root version. If workspaces carry versions, add the same comparison per versioned package.

## CI step

`origin/main` must exist in the checkout, so fetch full history (or `git fetch origin main`). Run on pull requests into `dev` and `main`, and on pushes to `dev` and `main`. A GitHub Actions sketch (**verify** current action versions and the Bun setup step against their docs):

```yaml
name: version
on:
  pull_request:
    branches: [dev, main]
  push:
    branches: [dev, main]
jobs:
  version:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@<current major>
        with:
          fetch-depth: 0
      - uses: <the Bun setup action, current major>
      - run: bun install --frozen-lockfile
      - run: bun test tests/versioning.test.ts
```

Mark this job as a required status check in the ruleset ([Branches and merging](branches-and-merging.md)), so no change merges without a valid, higher version. The rule must cover pull requests into both `dev` and `main`, since pushes to `main` skip the higher-than-main test.
