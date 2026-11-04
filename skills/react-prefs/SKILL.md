---
name: react-prefs
description: Use when writing, reviewing or refactoring React code that shows or hides UI, animates between states or navigations, or sets up the build for a React app. Enforces the owner's React preferences: Activity for every visibility toggle, ViewTransition wherever it can be used, and React Compiler with its best practices.
---

# React Preferences

Firm preferences for every React project. They are rules, not suggestions. Apply them to new code and to code you touch. For the wider stack (TanStack, Convex, UI libraries) see `web-stack`, which builds on this skill. For repository-wide conventions see `general-prefs`; for the runtime and tests see `bun-prefs` and `bun-stack-prefs`; for dependency versions see `upgrade-deps`.

This skill is model-, harness- and environment-agnostic. It names capabilities, never specific tools.

## Capabilities to look for (use them when present)

| Capability | Use it for | Fallback when absent |
|---|---|---|
| Web search / fetch | Checking current React, bundler and linter docs before relying on any version, flag or option named here | Say the fact is unchecked and keep the references' dates in the answer |
| Code execution | Running the project's tests, linter and build to prove the rules hold | Show the exact commands for the user to run |
| Structured question tool | Asking the user when a bundler or platform may not support the Compiler, or when a case seems to need real unmounting instead of Activity | Ask in plain numbered text |
| Memory / notes | Recording the user's answer when a case seems to need an exception, and why | Record it in the project's agent instructions file |

React moves fast. These rules rest on research dated 2026-11-04 (React 19.3). Before relying on an API name, version or flag, check the current docs with web search or fetch when available; items the references mark as unverified must be checked.

## Rules

1. **Activity replaces conditional rendering.** Always use `<Activity>` instead of `{condition && (element)}` and every variation of it (ternaries to `null`, early returns that hide a subtree, `display` or `hidden` toggling, class-based visibility, per-tab unmounting). Any visibility toggling in React goes through Activity. Details, caveats and what to do when a case seems to need real unmounting in [Activity](references/activity.md).
2. **ViewTransition wherever it can be used.** Use `<ViewTransition>` anywhere a state change, navigation, list change, reorder, Suspense reveal or show/hide can animate. When in doubt, add it. The general description of when it applies, and how to place it, is in [ViewTransition](references/view-transition.md).
3. **React Compiler, always.** Enable it in every React project, except when the bundler or platform cannot support it. Follow its best practices without exception. Setup per bundler and the practices are in [React Compiler](references/compiler.md).
4. **Prove it.** Add the project checks in [Checks](references/checks.md) so these rules fail CI when broken, and run them before reporting work done.

## Workflow

1. Before writing UI, read the reference for the rule you are about to apply.
2. For every show/hide, ask: is this Activity? For every state change a user can see, ask: does a `<ViewTransition>` fit?
3. For a new project or a project without the Compiler, set it up first, then lint.
4. Add or update the checks, run them with the project's test and lint commands, and report the results with the exit codes.

## References

- [Activity](references/activity.md): the replaced patterns, behavior while hidden, caveats, pre-rendering.
- [ViewTransition](references/view-transition.md): when to use, placement rules, triggers, props, browser support, Activity combination.
- [React Compiler](references/compiler.md): per-bundler setup, unsupported targets, lint, best practices.
- [Checks](references/checks.md): the bun test file and CI steps to add to the project.

## Session end and self-update

At the end of a session, if it surfaced general lessons (a changed API, a new bundler setup, a rule that proved wrong or incomplete), offer the user to update this skill with them. Add only general lessons, never project, user or account data.
