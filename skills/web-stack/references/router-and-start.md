# Router and Start

Research date: 2026-11-04. Verify against current docs before relying on any option below.

## Choosing

- **Client-only application**: TanStack Router (`@tanstack/react-router`), with view transition support set up so it matches React's `<ViewTransition>` (below).
- **Full-stack web application** (SSR, server functions, middleware): TanStack Start (`@tanstack/react-start`). Stable, announced 2026-10-13; npm 1.169.x needed Vite 8 at research. Start builds on Router, so the view transition rules apply to it too.
- React Compiler setup for Start is in [React Compiler](../../react-prefs/references/compiler.md) (no official TanStack page was found: test the build).

## View transitions that match React's

Router options (documented):

- `NavigateOptions.viewTransition`: `boolean | ViewTransitionOptions`, default false. `true` calls `document.startViewTransition()`. An object calls it with `{ update, types }`. If the browser lacks types support it falls back to a plain call; if it lacks the API the option is ignored.
- `defaultViewTransition: true | { types }` on `createRouter` applies it to every navigation. `types` can be an array, or a function of `{ fromLocation, toLocation, pathChanged, hrefChanged, hashChanged }` returning `string[] | false`. Returning `false` skips the transition.
- Reference example: `examples/react/view-transitions` in the TanStack Router repository (`defaultViewTransition` with direction types).

Findings that shape the rule (one RFC discussion #8188 from 2026-08-28 plus the React docs; not verified against current Router code):

- Router calls `document.startViewTransition` itself. Its React commit is wrapped in `startTransition`, but reads go through `useSyncExternalStore`, which forces a sync update after the transition scope exits, so React's `<ViewTransition>` reportedly never fires on a Router navigation.
- React calls `startViewTransition` itself, interrupts other running view transitions, and skips animations on popstate (back button).
- Reported issue: unhandled rejected `ready` and `finished` promises in router-core `startViewTransition` (issue 7906; a fix was open in PR 8802 on 2026-10-23). Check the installed version.
- Feature request, not shipped: respect `NavigateEvent.hasUAVisualTransition` so browser swipe-back animation does not conflict with `defaultViewTransition` (discussion 6432).

Rule (the "one mechanism per navigation" part is inference from these sources, not a documented rule):

1. At the start of the project, check the current Router docs and release notes with web search or fetch, and test whether a Router navigation triggers a `<ViewTransition>` placed around the outlet.
2. If it does not (the research finding), enable Router's view transition for route changes (`defaultViewTransition` with direction types, or per-navigation `viewTransition`) and do not wrap the outlet in `<ViewTransition>`. Use React `<ViewTransition>` everywhere else (lists, Suspense reveals, show/hide with Activity, shared elements), as `react-prefs` requires.
3. If it does, use `<ViewTransition>` for route changes and leave Router's option off, so only one mechanism animates each navigation.
4. Make the two match: one set of `::view-transition-*` styles and class names shared by both, the same durations and easing, the same transition types for the same direction, and `prefers-reduced-motion` honored (see [ViewTransition](../../react-prefs/references/view-transition.md)).
5. Never call `document.startViewTransition` by hand in application code.
6. Record the chosen mechanism and the verified Router version in the project's agent instructions file, and re-check when upgrading Router (`upgrade-deps`).

The checks are in [Checks](checks.md).
