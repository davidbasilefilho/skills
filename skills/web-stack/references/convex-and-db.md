# Convex and TanStack DB

Research date: 2026-11-04. TanStack DB is a release candidate and its Convex collection is new: verify names and options against current docs before use, and install the RC with the tag (`@rc`), then rewrite each written range as a zeroed caret that keeps the prerelease suffix, such as `^1.0.0-rc.1.3` (the form the `bun-prefs` range test accepts). Never leave the tag as the range; the lockfile fixes the exact version.

## Convex with TanStack Query

The rule: if the project uses TanStack Query, Convex queries and mutations must not use TanStack Query as well. Convex data goes through TanStack DB (below); TanStack Query serves only non-Convex data.

- Do not use `@convex-dev/react-query` (`convexQuery`, `ConvexQueryClient`, `useConvexMutation`) or wrap Convex results in a TanStack Query cache.
- Note that Convex's own docs recommend the adapter (a beta) for TanStack Start apps. This preference overrides that guidance; do not add the adapter.
- Convex's own React hooks and the Convex client remain the transport underneath the DB collection.

## TanStack DB with Convex (required)

Package: `@tanstack/convex-db-collection` (1.0.0-rc.1.3 on npm, published 2026-11-03). Install: `@tanstack/convex-db-collection @tanstack/db convex` (plus `@tanstack/react-db` in React).

- Setup: `createCollection(convexCollectionOptions({ id, client, query: api.tasks.list, queryArgs, getKey }))`, then `await collection.preload()`. `client` is a `ConvexClient` or a `ConvexReactClient` (including the one from `useConvex()`).
- Eager sync: DB filters, ordering and limits run locally over the subscribed result. Pagination uses `convexPaginatedCollectionOptions` (requires a `paginationOpts` query).
- Writes: `onInsert`, `onUpdate`, `onDelete` call `client.mutation(...)`. The mutation must use the same client as the subscription.
- Convex `_id` is server-assigned: for optimistic inserts add an application key such as `clientId` and use it in `getKey`.
- Newer docs use `DbClient` / `DbProvider` and `collectionOptions(id, factory)` descriptors while still showing `createCollection` for the Convex adapter: check which form the installed version expects.
- Do not use the community packages `@michaelstewart/convex-tanstack-db-collection` or `@trestleinc/convex-replicate-core` unless the user asks.
- In DB 1.0 the Query Collection no longer refetches after mutation handlers: `await collection.utils.refetch()`.

## Cached-first loading (key rule)

Answer from the research: yes, TanStack DB can save data in the client and restore it on page load, but persistence is opt-in per collection and, by default, restored rows are put in the collection while `status` stays `loading` until the sync adapter calls `markReady()`. The page would still show a loading state. So:

**Rule: configure client persistence and initial render from local data for every collection whose data can be shown, so the page shows cached data on load instead of a loading state.**

Verified in the docs (SQLite persistence guide, browser persistence README, DB 0.6 post):

- Packages: `@tanstack/browser-db-sqlite-persistence` (OPFS in the browser; also `@tanstack/db-sqlite-persistence-core`). Exports include `openBrowserWASQLiteOPFSDatabase`, `createBrowserWASQLitePersistence` and `persistedCollectionOptions`.
- The browser needs OPFS and a secure context. Multi-tab needs a `BrowserCollectionCoordinator` (Web Locks plus BroadcastChannel).
- Wrap a synced adapter by spreading its options: `persistedCollectionOptions({ ...adapterOptions, persistence, schemaVersion: 1, initialRender: {...} })`. The docs example wraps `queryCollectionOptions`; `electricCollectionOptions` appears in the on-demand example.
- To render cached rows immediately: `initialRender: { strategy: 'network-first', networkTimeoutMs: 0 }`. With rows restored the collection becomes `ready` from them and the network sync applies over them. An empty restore still waits for the network, so an empty list always means "no rows". The default timeout is 3 seconds.
- Keep the same `id` and `schemaVersion` across loads (the wrapper resets on schema change; details unverified). The restore must finish on first load; a failed restore crashes the collection.
- Isolate persisted data per user or tenant (include the user or tenant in the database name or collection id), and clear it on sign-out: cached rows can otherwise show after an auth failure.
- Other options: the IndexedDB Collection is local-only (loads the whole store into memory, no server sync) and `localStorageCollectionOptions` is for small preferences; neither is the path for synced Convex data. `@tanstack/offline-transactions` keeps a durable outbox of pending writes (IndexedDB with a localStorage fallback, leader tab, `idempotencyKey`, needs stable collection ids).

Unverified (flag to the user, test before relying):

- No documented example combines `persistedCollectionOptions` with `convexCollectionOptions`. The Convex page mentions a "wrapping persistence layer", and says "Use the offline bridge for durable writes. A full read cache and an SSR snapshot fetch remain separate concerns." The expected setup is therefore an inference:

```ts
persistedCollectionOptions({
  ...convexCollectionOptions({ id, client, query, queryArgs, getKey }),
  persistence,
  schemaVersion: 1,
  initialRender: { strategy: "network-first", networkTimeoutMs: 0 },
});
```

- If it does not work for the installed versions, do not drop the rule silently: check current docs and issues, try the nearest supported path, report to the user what was and was not achieved, and keep the check in [Checks](checks.md) failing or marked as a known gap with the reason.
- SSR is a separate concern: `DbClient` with `preloadLiveQuery()` on the server and a browser `DbClient` hydrated from the transported snapshot. In 1.0, rows are rendered on the server only with an explicit preload, otherwise the server renders empty or loading state. In Start, use it so the first paint is not a loading state either.

The test that proves this is in [Checks](checks.md): a static check that each collection is persisted with `networkTimeoutMs: 0`, and a browser reload check that no loading state appears before cached data.
