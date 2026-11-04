# ViewTransition

Source: react.dev ViewTransition reference, the React 19.3 post (stable since 19.3, 2026-09-09; latest at research time 19.3.1), the React Labs post of 2025-04-23. Pages that call it "canary" or "experimental" are stale. DOM only: React Native is not supported. Re-check current docs before relying on prop names.

## General description: when to use

Use `<ViewTransition>` anywhere the user sees one visual state replaced by another and the change can be driven by a Transition:

- Navigation between pages or sections.
- Show and hide: expand and collapse, open and close, tab switches, drawers, modals (combine with Activity).
- Lists: items entering, leaving or reordering.
- Shared elements: a thumbnail that becomes a hero image, list item to detail view (use a `name`).
- Suspense: fallback to content reveal.
- Any `startTransition`, `useTransition` or `useDeferredValue` update that changes what is on screen.

When in doubt, add it. The only things it does not replace are CSS or JS animations of a single element (a like button, a skeleton shimmer).

## Triggers

- Only updates inside `startTransition` or `useTransition`, a Suspense reveal, or a `useDeferredValue` update animate. A plain `setState` does not, so wrap the update in a Transition.
- A `flushSync` in the middle makes React skip the transition.
- React calls `startViewTransition` itself. Never call it yourself in React code, because React interrupts it. React skips animations on popstate (back button).
- Enter and exit fire for the first inserted or removed boundary. Update fires on DOM mutation inside the boundary or a size or position change. Share fires when a named boundary in a deleted tree pairs with the same name in an inserted tree, and it wins over enter and exit.

## Placement rules

- `<ViewTransition>` must come before any DOM node in the component. `<div><ViewTransition>` does not activate.
- Names are for shared elements only and must be globally unique among mounted boundaries, for example `item-${id}`. Duplicates make the transition error.
- Boundaries animate as one snapshot, not per element. Add more boundaries where children must move on their own.
- `<ViewTransition><Suspense>` gives a cross-fade (update) from fallback to content. The docs describe a second placement that could not be read during research: check the docs.
- A shared transition does not happen if a Suspense fallback shows between unmount and mount.
- React waits up to 500 ms for fonts and visible images before animating.

## Props

- `name`, `enter`, `exit`, `update`, `share`, `default`: each takes `"auto"`, `"none"`, a CSS class string, or an object keyed by transition type plus `default`. `default="none"` turns off every trigger not listed.
- `onEnter`, `onExit`, `onUpdate`, `onShare`: callbacks `(instance, types)` using the Web Animations API that must return a cleanup function. One event fires per boundary, and `onShare` wins.
- `addTransitionType` supplies the `types` the object form matches.
- Prefer a View Transition Class with `::view-transition-*(.class)` selectors over raw `view-transition-name` styling.

## Accessibility

Always honor `prefers-reduced-motion`; React does not disable animations itself. Add a media query that sets the view transition pseudo-elements to `animation: none`.

## Browser support

- Same-document `startViewTransition`: Baseline since 2025-10-14 (Chrome and Edge 111+, Safari 18+, Firefox 144+).
- Transition types: Chrome 125+, Safari 18.2+, Firefox 147+. `addTransitionType` and object-form class props may degrade on Firefox 144 to 146.
- In browsers without the API the DOM update still happens without animation (inference, not stated in a React doc). Test it.

## With Activity

```tsx
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <ViewTransition enter="auto" exit="auto"><Counter /></ViewTransition>
</Activity>
```

The show or hide must come from a Transition to animate.

## With a router

React's `<ViewTransition>` and a router's own View Transition call must not both animate the same navigation. See `web-stack` ([Router and Start](../../web-stack/references/router-and-start.md)) for the TanStack Router rule.
