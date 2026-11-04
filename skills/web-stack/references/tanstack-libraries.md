# TanStack libraries

Research date: 2026-11-04. Statuses and versions change often: confirm each against current docs (https://tanstack.com/libraries) with web search or fetch before installing. Where a package name is marked unconfirmed, check that the library exists for the project's framework and find the real package name first.

Use every library below wherever the application can use it. Reaching for `useState` plumbing, hand-written `fetch` effects, custom tables, ad-hoc `keydown` listeners, `setTimeout` debouncing or a `dangerouslySetInnerHTML` markdown renderer when a TanStack library does the job is a defect.

| Library | React package | Status at research | Use when the application has |
|---|---|---|---|
| Store | `@tanstack/react-store` | Status unconfirmed (a June 2026 secondary source said alpha 0.11.0) | State shared by more than one component or route, or the same `useState` shape repeated. Replaces lifted state, context-for-state and repeated `useState`. |
| Query | `@tanstack/react-query` | Stable, 5.x | Data from non-Convex HTTP or async sources: replaces `fetch` + `useEffect` + manual loading and error state. Never for Convex (see [Convex and TanStack DB](convex-and-db.md)). |
| Form | `@tanstack/react-form` | Stable v1 (a secondary source mentions v2 alpha) | Any form with more than one field, validation or submit state. Replaces `useState` per field. |
| Table | `@tanstack/react-table` | Stable v9 | Any tabular data: sorting, filtering, pagination, selection, grouping. Headless, so render with Base UI and Tailwind. |
| Virtual | `@tanstack/react-virtual` | Stable v3 | Any long list, table body, select or combobox with many options, feed or log. |
| Charts | package not seen; core is `@tanstack/charts` (1.2.1 published) | Alpha policy before 1.0; stability wording unconfirmed | Any chart or sparkline. Confirm the React package first. |
| Markdown | `@tanstack/markdown` (1.x, React adapter) | Stable 1.x (older July articles say alpha; the 2026-10-01 post says 1.0) | Rendering Markdown content, model output, docs or comments. |
| Highlight | `@tanstack/highlight` (1.x) | Stable 1.x | Syntax-highlighted code, synchronous and identical on server and client. |
| AI | an `@tanstack/ai-*` React adapter (name unconfirmed) | Past 0.x (1.0 upgrade guide exists) | Streaming chat, typed tools, provider swapping. Replaces per-provider SDK glue. |
| Hotkeys | `@tanstack/react-hotkeys` (inferred, unconfirmed) | Beta per its docs | Any keyboard shortcut. Replaces ad-hoc `keydown` listeners. |
| Pacer | `@tanstack/react-pacer` (inferred, unconfirmed) | Beta | Debounce, throttle, rate limit, queue, batch: search inputs, resize, autosave, button spam. Replaces hand-rolled `setTimeout` and lodash debounce. |
| DB | `@tanstack/react-db` (core `@tanstack/db`) | 1.0.0-rc.1 (announced 2026-10-29) | Required with Convex. Replaces ad-hoc client caches and hand-written optimistic updates. See [Convex and TanStack DB](convex-and-db.md). |
| Router | `@tanstack/react-router` | Stable 1.x | See [Router and Start](router-and-start.md). |
| Start | `@tanstack/react-start` | Stable (announced 2026-10-13; needs Vite 8 at research) | See [Router and Start](router-and-start.md). |

Docs: https://tanstack.com/{store,query,form,table,virtual,charts,markdown,highlight,ai,hotkeys,pacer,db,router,start}/latest/docs/overview (verify each URL).

## Store

Verified against the current reference at research time:

- API: `createStore(initialValue)` returns a `Store<T>`; update with `store.setState(fn)`. `createStore(initialValue, actions)` adds actions. `createStore(getValue)` with a function returns a derived `ReadonlyStore<T>`. `createAtom` / `createAsyncAtom` exist in `@tanstack/store`, which also exports `batch`, `flush`, `shallow`, `compareShallow` and `compareDeep`.
- React: `useSelector(store, selector)` re-renders only when the selected slice changes. `useStore` is a deprecated alias of it. `@tanstack/react-store` also exports `useAtom`, `useCreateStore`, `useCreateAtom` and `createStoreContext`.
- The old `Store` plus `new Derived({...})` form is outdated; no `Derived` class was found in the current reference and no migration guide was read. Check the docs.
- Pattern (inference): a module-level store plus selector hooks, instead of lifting state into props or context. Use `createStoreContext` when the state must be scoped per tree (for example per test or per tenant).
- Convex data does not go in a Store: it lives in TanStack DB collections.
