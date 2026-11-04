# Activity

Source: react.dev Activity reference and the React 19.2 post (stable since 19.2, 2025-10-01). Re-check the current docs before relying on details.

## API

- Props: `children` and `mode`, either `'visible'` (default) or `'hidden'`. More modes are planned, so check the docs.

```tsx
<Activity mode={isOpen ? 'visible' : 'hidden'}>
  <Sidebar />
</Activity>
```

## What it replaces

Always rewrite these to Activity:

- `{isVisible && <Page />}` and `{isVisible && (<Page />)}`.
- `isVisible ? <Page /> : null` and the inverse.
- Per-tab or per-route-section unmounting, modals, drawers, popovers, sidebars, accordions and collapsed panels.
- Back navigation that should keep input state.
- CSS `display`, `hidden` attribute, `visibility` or class toggles driven by state. The docs name `&&` and tab conditionals; treating `display` toggles and ternaries the same way is the preference here.

## Behavior while hidden

- Children get `display: none`.
- Effects are destroyed and their cleanups run. State and DOM are preserved (a hidden `<textarea>` keeps its draft).
- Children still re-render on new props, at lower priority.
- On show, state is restored and Effects are re-created.

## Caveats (follow them)

- Treat hidden as unmounted. Put any undo of a side effect in the Effect cleanup, never in logic that relies on the Effect mounting.
- DOM side effects persist while hidden. Media such as `<video>` keeps playing: return a cleanup from `useLayoutEffect` that pauses it (the docs prefer `useLayoutEffect` because a re-suspending boundary or a View Transition can delay `useEffect`). The docs list further affected tags, but that list could not be read during research: check the Activity docs for it.
- StrictMode eagerly performs Activity unmounts and mounts, which exposes Effects with missing cleanup. Fix the Effect.
- A hidden Activity whose child only renders a text string outputs nothing, because there is no DOM node to hide. Wrap the text in an element.
- Hidden trees keep re-rendering at low priority and hold DOM and memory. Keep very large or expensive hidden trees small, split them, or pass less state into them.

## Pre-rendering and hydration

- A `hidden` Activity on first render still renders its children at low priority, without mounting Effects. This loads code and data early.
- Only Suspense-activating reads such as `use(promise)` fetch while hidden. Data fetched inside an Effect does not.
- Activity boundaries enable selective hydration, including a plain always-visible `<Activity>`. Wrapping tab content lets the tab buttons hydrate first.

## When a case seems to need real unmounting

Activity is always used. When a case seems to need a true unmount (reset state, release a resource, react to Effect mount), do not fall back to conditional rendering. Ask the user (structured question tool when available, plain question otherwise) and record the answer in the project's agent instructions file. The check in [Checks](checks.md) allows nothing by comment.

## Unverified

- Activity inside lists: no doc statement found. Test it in the project before relying on it.
- SSR output of a hidden Activity: only selective hydration is documented. Verify before depending on server output.
- The complete list of tags with persistent DOM side effects (see above).

## With ViewTransition

A show or hide inside a Transition triggers `enter` and `exit` of a `<ViewTransition>` placed inside the Activity. See [ViewTransition](view-transition.md).
