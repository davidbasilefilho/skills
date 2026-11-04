---
name: general-prefs
description: Use when setting up, changing or reviewing a repository's branching, pull requests, merging, release versioning or CI gates, or when preparing any change that will land in dev or main. Enforces the owner's repository preferences: squash and merge always, main and dev as the two permanent branches, a version higher than main on every change, release branch pull request stacks, and ZeroVer validated by tests.
---

# General Preferences

Firm preferences for every repository. They are rules, not suggestions. Apply them to new work and to work you touch. For the runtime, ranges and tests see `bun-prefs` and `bun-stack-prefs`; for dependency upgrades see `upgrade-deps`; for React see `react-prefs` and `web-stack`.

This skill is model-, harness- and environment-agnostic. It names capabilities, never agent tools.

## Capabilities to look for (use them when present)

| Capability | Use it for | Fallback when absent |
|---|---|---|
| Web search / fetch | Checking current docs for stacked pull requests, repository settings, rulesets and CI actions before relying on a name, flag or field marked unverified | Say the fact is unchecked and ask the user to confirm it |
| Code execution | Running the version tests and the stack commands | Show the exact commands for the user to run |
| Structured question tool | Asking which version to bump to or how a stack should be split | Ask in plain numbered text |
| Memory / notes | Recording that a repository already follows a rule, and where its settings live | Record it in the project's agent instructions file |

## Rules

1. **Squash and merge, always.** Every pull request, stacked or not, merges by squash. Configure the repository and the branch rules so no other method is possible. Setup in [Branches and merging](references/branches-and-merging.md).
2. **Two lifetime-long branches: `main` and `dev`.** Nothing else lives forever. Pull requests go into `dev`, and `dev` goes into `main`.
3. **Every `main` commit has a different version.** Each change must therefore carry a version higher than the one on `main`. This must be tested in pull requests and on `dev`: add the version test and CI step in [Versioning](references/versioning.md) to the project and run it.
4. **Release branch stacks.** The first branch of a release stack must be `release/0.Y.Z/version`, and every other stack branch follows the same prefix. The naming rule is below; the commands are in [Pull request stacks](references/stacks.md).
5. **Pull request stacks, always.** Every change goes in as a stack of pull requests using the host's native stacked pull request support (`gh` on GitHub). Fall back to manually based branches only when that support is unavailable, as described in [Pull request stacks](references/stacks.md).
6. **ZeroVer, always.** Every version is `0.Y.Z`; the major version never leaves 0. This must be validated: add the ZeroVer test in [Versioning](references/versioning.md) to the project and run it.

## Release branch naming

`0.Y.Z` is the version the stack releases.

- First branch of the stack, the one that bumps the version: `release/0.Y.Z/version`. It targets `dev`.
- Every other branch: `release/0.Y.Z/<type>/<change>`, where `<type>` is the kind of change (for example `feat`, `fix`, `refactor`, `docs`, `chore`) and `<change>` is a short kebab-case slug. Each targets the branch below it.
- Always pass the branch names explicitly, so the shared `release/0.Y.Z/` prefix is never lost to auto-generated names.
- Never create a bare `release/0.Y.Z` branch, and never use `version` as a `<type>`. Git refs are paths, so a branch cannot coexist with a branch nested under its name.

Example stack onto `dev`: `release/0.5.0/version`, `release/0.5.0/feat/schema`, `release/0.5.0/feat/api`.

## Workflow

1. Read the project's current version on `main` and on `dev`. Choose a `0.Y.Z` strictly higher than `main`'s, and ask the user when the bump size is unclear.
2. Create the stack: the `version` branch first, then one branch per change, named as above. On the `version` branch set the new version through the project's single version source (the `version:sync` script from `bun-prefs`, or its equivalent), never by editing manifests by hand.
3. Add or update the checks in [Versioning](references/versioning.md) and the repository settings in [Branches and merging](references/branches-and-merging.md) when missing.
4. Run the project's tests, including the version and ZeroVer tests, and report the commands with their exit codes.
5. Merge the stack with squash into `dev`, then merge `dev` into `main` with squash.

## References

- [Branches and merging](references/branches-and-merging.md): main and dev, squash-only repository settings and ruleset, required checks.
- [Pull request stacks](references/stacks.md): stacked pull request commands, naming in practice, fallback without native support.
- [Versioning](references/versioning.md): ZeroVer test, version-higher-than-main test, CI workflow.

## Session end and self-update

At the end of a session, if it surfaced general lessons (a changed command or setting name, a stack pitfall, a rule that proved wrong or incomplete), offer the user to update this skill with them. Add only general lessons, never project, user or account data.
