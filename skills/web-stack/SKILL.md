---
name: web-stack
description: Use when starting, extending or reviewing a React web application and choosing its libraries, state, data layer, routing, backend, authentication, UI components or styling. Applies the owner's web stack: react-prefs, the TanStack libraries everywhere they fit, TanStack Router or Start, Convex with TanStack DB and cached-first loading, Clerk or Better Auth for auth, Base UI, Tailwind CSS and cn.
---

# Web Stack

Firm preferences for web applications. They are rules, not suggestions. React code follows `react-prefs` (Activity, ViewTransition, React Compiler) without exception. Runtime, package manager and tests follow `bun-prefs` and `bun-stack-prefs`, repository conventions follow `general-prefs`, and dependency versions are handled by `upgrade-deps`.

This skill is model-, harness- and environment-agnostic. It names capabilities, never specific tools.

## Capabilities to look for (use them when present)

| Capability | Use it for | Fallback when absent |
|---|---|---|
| Web search / fetch | Checking every package, version and API named in the references against current docs before use (these libraries move fast, some are beta or release candidates) | Say the fact is unchecked, cite the research date (2026-11-04) and ask the user to confirm |
| Code execution | Installing, building, running the checks in [Checks](references/checks.md), confirming a package exists for the project's framework | Give the exact commands for the user to run |
| Structured question tool | Asking whether to add shadcn/ui and other user choices | Ask a plain numbered question |
| Browser automation / visual inspection | Reloading the page to confirm cached data renders without a loading state, and seeing view transitions | Describe the manual steps and ask the user to report the result |
| Memory / notes | Recording stack decisions per project | Record them in the project's agent instructions file |

## Rules

1. **React** uses `react-prefs`. Read it first.
2. **TanStack Store** must always be used when beneficial over repeated `useState` and shared state in general: when two or more components, hooks or routes share state, or the same `useState` shape repeats, use a store with selectors. See [TanStack libraries](references/tanstack-libraries.md).
3. **TanStack libraries everywhere they can be used**: Charts, Table, Form, Markdown, AI, Highlight, Virtual, Hotkeys, Pacer and Query. For every feature, check the list of use cases in [TanStack libraries](references/tanstack-libraries.md) and use the matching library; do not hand-roll what one of them does. For any library the references report as unreleased, missing or unconfirmed for the project's framework, keep the rule but first check whether it exists for that framework (web search or fetch, or the package registry) before using it.
4. **Routing**: TanStack Router for client-only applications, with view transitions that match React's `<ViewTransition>`: each navigation is animated by exactly one mechanism, Router's own view transition option or React's `<ViewTransition>`, never both, and both share the same styles, class names, durations, easing and transition types per direction. Verify which mechanism a navigation triggers on the installed Router version. TanStack Start for full-stack web applications. See [Router and Start](references/router-and-start.md).
5. **Backend**: Convex. If the project uses TanStack Query, Convex queries and mutations must not go through TanStack Query as well. With Convex, TanStack DB is required. See [Convex and TanStack DB](references/convex-and-db.md).
6. **Cached-first loading**: check whether TanStack DB saves data in the client and loads it on page load, and configure client persistence and initial render from local data wherever the information can be used, so the page shows cached data on load instead of a loading state. By default a Convex page sits in a loading state until synced, which this rule exists to remove. Setup, unverified parts and the check are in [Convex and TanStack DB](references/convex-and-db.md).
7. **UI and styling**: Base UI plus Tailwind CSS, and shadcn/ui only if the user wants it: ask the user (structured question tool when available, plain question otherwise) and do not add it unasked. Use the `cn` package for class merging. See [UI](references/ui.md).
8. **Auth**: Clerk by default. Better Auth plus Convex when the project wants its auth data in its own Convex deployment, needs features or pricing Clerk does not fit, or must avoid per-user fees. When the choice is not settled, ask the user (structured question tool when available, plain question otherwise). Install only one of them. See [Auth](references/auth.md).
9. **Prove it**: add the checks in [Checks](references/checks.md) to the project and run them before reporting work done.

## Workflow

1. For a new project, pick Router or Start (rule 4), then Convex with TanStack DB (rule 5), then the UI stack (rule 7), then auth if the project has accounts (rule 8). Ask the shadcn/ui question once.
2. For each feature, walk the library list in [TanStack libraries](references/tanstack-libraries.md) and use every library that fits.
3. Before installing anything, verify the package and version against current docs. The research behind these references is dated 2026-11-04; several libraries are beta or release candidates and package names for Hotkeys, Pacer, AI and Charts are unconfirmed.
4. Add the checks, run them, and report commands with exit codes.

## References

- [TanStack libraries](references/tanstack-libraries.md): package, status and when to use each, plus Store usage.
- [Router and Start](references/router-and-start.md): Router for client-only apps, Start for full-stack, view transitions that match React's.
- [Convex and TanStack DB](references/convex-and-db.md): the Convex rule, DB collection setup, cached-first persistence, unverified parts.
- [Auth](references/auth.md): Clerk and Better Auth with Convex for Start and client-only Router, the feature set, and how auth fits TanStack DB.
- [UI](references/ui.md): Base UI, Tailwind, `cn`, opt-in shadcn/ui.
- [Checks](references/checks.md): bun tests and CI steps to add.

## Session end and self-update

At the end of a session, if it surfaced general lessons (a changed package name or status, a verified setup for an unverified item, a rule that proved wrong), offer the user to update this skill with them. Add only general lessons, never project, user or account data.
