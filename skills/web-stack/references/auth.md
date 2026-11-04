# Auth

Research date: 2026-11-04. Package versions come from npm snapshots that disagree with each other, and Better Auth for Convex is pre-1.0: verify every name, option and range against current docs before use. Items marked **verify** were not confirmed by the research. Items marked **inference** are judgment built on the sourced facts, not documented behavior.

Ranges follow `bun-prefs`: zeroed caret, prerelease suffix allowed, plus its peer-range rule for `better-auth` (see Status and pinning). After `bun add`, rewrite the written range.

## Choosing

Default to **Clerk** (auth as a service). Use **Better Auth plus Convex** when the project wants its auth data in its own Convex deployment, needs features or pricing Clerk does not fit, or must avoid per-user fees. When the choice is not settled, ask the user (structured question tool when available, plain question otherwise) and record the answer in the project's agent instructions file. Install exactly one: the check in [Checks](checks.md) fails when both are present.

| | Clerk | Better Auth plus Convex |
|---|---|---|
| Hosting | Hosted service, prebuilt UI, webhook-based user sync | Open source (the Convex component is Apache-2.0), runs in your Convex deployment, you build the UI |
| Data | Users and sessions live at Clerk (lock-in, inference) | Auth data lives in your Convex deployment |
| Cost | Hobby free to 50,000 monthly retained users per app; Pro $25/mo ($20 annual) plus $0.02 per extra retained user; MFA, custom session lifetime and removing branding start at Pro; organizations billed separately (100 free retained orgs). Source: clerk.com/pricing, undated snapshot, verify | No per-user fee from Better Auth; your costs are email sending and Convex usage (inference) |
| Maturity | Stable (inference) | `@convex-dev/better-auth` is in Convex's labs docs, pre-1.0 (about 0.13.0), tied to a pinned `better-auth` minor |
| Gaps | None confirmed for the stack below; see [Unverified](#unverified) | See [Gaps](#gaps) |

## Clerk with Convex

Sources: docs.convex.dev/auth/clerk, clerk.com/docs/guides/development/integrations/databases/convex, docs.convex.dev/auth/database-auth.

### Dashboard and Convex (both frameworks)

1. In the Clerk dashboard activate the Convex integration and copy the Frontend API URL. There is no JWT template step any more: activating the integration maps the `aud` claim.
2. `convex/auth.config.ts`:

```ts
export default {
  providers: [{ domain: process.env.CLERK_JWT_ISSUER_DOMAIN!, applicationID: "convex" }],
};
```

3. Set the variable in Convex, because Convex functions do not read `.env`: `bunx convex env set CLERK_JWT_ISSUER_DOMAIN <frontend-api-url>`. The Convex page uses `CLERK_JWT_ISSUER_DOMAIN` and the Clerk page `CLERK_FRONTEND_API_URL` for the same value, so the name is free if the config and the env agree.
4. Production: `bunx convex env --prod set CLERK_JWT_ISSUER_DOMAIN https://clerk.<domain>.com`, then `bunx convex deploy`. The docs show `npx`; `bunx` is the Bun equivalent.

### Client-only TanStack Router

- Install `@clerk/react` (`^6.0.0`; the Convex docs use this name, not `@clerk/clerk-react`) and `convex`.
- Key variable: `VITE_CLERK_PUBLISHABLE_KEY`.
- Nest `<ClerkProvider publishableKey={...}>` outside `<ConvexProviderWithClerk client={convex} useAuth={useAuth}>`. `useAuth` comes from `@clerk/react`, `ConvexProviderWithClerk` from `convex/react-clerk`.
- Gate UI with Convex's `Authenticated`, `Unauthenticated`, `AuthLoading` and `useConvexAuth()`, not Clerk's `useAuth()`: Convex's state says when the token is accepted by the backend.
- The docs show no `beforeLoad` guard for this case. Route guards: see below.

### TanStack Start

Sources: docs.convex.dev/client/tanstack/tanstack-start/clerk, template github.com/get-convex/templates (`template-tanstack-start-clerk`).

- Install `@clerk/tanstack-react-start` (`^1.0.0`).
- A `createServerFn` calls `auth()` from `@clerk/tanstack-react-start/server` and returns `{ userId, token: await getToken() }`.
- The root route's `beforeLoad` calls it. With a token it calls `ctx.context.convexQueryClient.serverHttpClient?.setAuth(token)` so SSR loaders are authenticated, and returns `{ userId, token }`. That identifier belongs to the Query adapter this stack forbids: `convexQueryClient` must not appear in `src`, because the check in [Checks](checks.md) fails on it.
- The root component renders `<ClerkProvider><ConvexProviderWithClerk client={context.convexClient} useAuth={useAuth}>`.
- The template wires `ConvexQueryClient` from `@convex-dev/react-query` into the router for SSR. This stack forbids that adapter (see [Convex and TanStack DB](convex-and-db.md)): take the Clerk and token wiring from the template, replace the Query-adapter SSR wiring with the `DbClient` snapshot approach, and **verify** that the server-side Convex client can still be authenticated without the adapter.
- The Clerk docs page uses a `<Show>` component in its TanStack example; its semantics were not read. **Verify** before using it.

### Identity in Convex functions

`const identity = await ctx.auth.getUserIdentity()` returns `null` when unauthenticated. `identity.subject` is the Clerk user ID. Authorize every query and mutation from `identity`, never from a client-supplied user ID. Throw on `null` in functions that require a user.

### User sync

Optional: `getUserIdentity()` alone is enough when only the identity is needed. To keep an app `users` table:

1. Schema: `users` with `externalId` and an index `byExternalId`.
2. Clerk dashboard: add a webhook endpoint at `https://<deployment>.convex.site/clerk-users-webhook` (the domain ends in `.site`, not `.cloud`), subscribe to the `user` events, and store the `whsec_` secret as `CLERK_WEBHOOK_SECRET` in Convex env.
3. A Convex `httpAction` verifies the request with `svix` (`Webhook.verify` over the `svix-id`, `svix-timestamp` and `svix-signature` headers; `svix` version not checked, **verify**).
4. On `user.created` and `user.updated` it runs an `internalMutation` upsert keyed by `externalId`; on `user.deleted` it runs a delete mutation.

### Route guards

Inference: the docs show `userId` in the Start root context but no redirect snippet. Guard private routes in `beforeLoad` by throwing `redirect({ to: "/sign-in" })` when `context.userId` is missing (Start) and render `Authenticated`/`Unauthenticated` for the UI (client-only). The server check is the only real protection: every Convex function must still check `getUserIdentity()`.

## Better Auth with Convex

Sources: labs.convex.dev/better-auth (framework guides, supported-plugins, features/local-install, basic-usage), github.com/get-convex/better-auth issues 179 and 350, github.com/better-auth/better-auth issue 7635.

### Status and pinning

- `@convex-dev/better-auth` is pre-1.0 (about 0.13.0 at research; 766 stars, 135 open issues). A caret on a 0.x version allows only that minor, so `^0.13.0` is the zeroed-caret form here.
- Peer ranges: `better-auth >=1.7.16 <1.8.0`, `convex ^1.25.0`, React 18 or 19. The Start guide pins `better-auth@~1.7.16`; the React guide still says `~1.6.15`, which conflicts with the peer range: trust the peer range. Earlier releases were pinned tightly (0.9.x did not work with 1.4.x).
- `better-auth` therefore cannot satisfy both the peer range and a zeroed caret (`^1.0.0` admits 1.8 and later). The `bun-prefs` peer-range rule applies: declare `better-auth` as `~1.7.16`, the peer range, and rewrite what `bun add` writes. The range test accepts it because the installed `@convex-dev/better-auth` requires it. Move it only when the component's peer range moves (`upgrade-deps`).
- Pre-1.0 means breaking changes between minors: upgrade the component and `better-auth` together, read the release notes first, and re-run the auth checks.

### Setup, TanStack Start

Source: labs.convex.dev/better-auth/framework-guides/tanstack-start.

1. Install `@convex-dev/better-auth` and `better-auth`.
2. `vite.config.ts`: `ssr: { noExternal: ["@convex-dev/better-auth"] }`.
3. `convex/convex.config.ts`: `app.use(betterAuth)`.
4. `convex/auth.config.ts` uses `getAuthConfigProvider()`.
5. Convex env: `BETTER_AUTH_SECRET` and `SITE_URL`.
6. `convex/auth.ts` builds `betterAuth({ database: authComponent.adapter(ctx), plugins: [convex({ authConfig })] })`, importing `betterAuth` from `better-auth/minimal`.
7. Client: the Better Auth client with the `convexClient()` plugin.
8. `src/lib/auth-server.ts`: `convexBetterAuthReactStart(...)` returns `handler`, `getToken` and `fetchAuthQuery`, `fetchAuthMutation`, `fetchAuthAction`.
9. `convex/http.ts`: `authComponent.registerRoutes(http, createAuth)`.
10. Proxy route `src/routes/api/auth/$.ts` forwards to `handler`.
11. Root `beforeLoad` calls a server function returning `getToken()`, then `serverHttpClient?.setAuth(token)`; the root renders `<ConvexBetterAuthProvider initialToken={...}>`. As with Clerk, the `serverHttpClient` here comes from the forbidden Query adapter: **verify** the SSR wiring without it.
12. Production: `bunx convex env --prod set BETTER_AUTH_SECRET <secret>` and `bunx convex env --prod set SITE_URL https://<app-domain>`, then `bunx convex deploy` (the docs show `npx`). Inference from the Clerk flow and step 5: **verify** the variable names and the production steps against the guide.

### Setup, client-only TanStack Router

Source: labs.convex.dev/better-auth/framework-guides/react. Same pattern as Start with these differences:

- Add the `crossDomain({ siteUrl })` plugin on the server and `crossDomainClient()` on the client.
- `baseURL` is `CONVEX_SITE_URL` and `trustedOrigins` is `[siteUrl]`.
- `authComponent.registerRoutes(http, createAuth, { cors: true })`.
- The provider is `<ConvexBetterAuthProvider client={convex} authClient={authClient}>`. `expectAuth: true` on `ConvexReactClient` is optional.
- No proxy route and no `initialToken`.

### Route guards and UI gating

Inference: the guides show `getToken()` in the root `beforeLoad` and `Authenticated`-style components, but no redirect snippet. **Verify** against the installed version.

- **Start.** Have the root `beforeLoad` also return `isAuthenticated: Boolean(token)` from the token it already fetches. Put private routes under a pathless layout route whose `beforeLoad` throws `redirect({ to: "/sign-in" })` when `context.isAuthenticated` is false, and make the sign-in route redirect away when it is true. Render `Authenticated`, `Unauthenticated` and `AuthLoading` for the UI.
- **Client-only.** There is no server step, so gate the UI: `Authenticated`, `Unauthenticated`, `AuthLoading` and `useConvexAuth()` from Convex. Show the loading state while `isLoading`; do not redirect before it settles, or a signed-in user is bounced on reload.
- **Convex functions.** Gating is for experience only. Every query and mutation still checks `ctx.auth.getUserIdentity()` and authorizes from it.

### Feature coverage

A thorough integration covers every row below. Sign-in, sign-up and sign-out must be called from the client, not from Convex functions. Anything not in the table is not covered: do not claim it.

| Feature | How | Status |
|---|---|---|
| Email and password | Built in | Works (README and Start guide) |
| Email verification and password reset | Sent from `createAuth` through an action context (`requireActionCtx`); the docs example uses the `@convex-dev/resend` component | Documented in basic-usage; test both flows end to end |
| OAuth, social providers | Built in social providers, plus the Generic OAuth plugin for custom providers | Works out of the box |
| Magic link | Magic Link plugin | Supported out of the box |
| One-time code | Email OTP and Phone Number plugins | Supported out of the box |
| Other sign-in | Anonymous, Username, One Tap | Supported out of the box |
| Two-factor | Two Factor plugin | Supported out of the box |
| Sessions | Component session model; JWT plugin for Convex tokens | Supported; **verify** device listing and revocation flows |
| Rate limiting | `rateLimit` model in the component | Present in the model list (issue 350); **verify** it is enabled and tuned for the auth endpoints |
| Passkeys | `@better-auth/passkey` (moved out of the core package in 1.4) | Needs Local Install; full flow **verify** |
| Organizations and roles | Organization plugin | Needs Local Install (issue 350); full flow **verify** |
| Admin | Admin plugin | Needs Local Install (better-auth issue 7635); full flow **verify** |
| Auth data change hooks | Component Triggers | Docs list a Triggers page; not read, **verify** |

**Local Install** (labs.convex.dev/better-auth/features/local-install): plugins outside the out-of-the-box list need the component's own schema, generated with `bunx auth@1.7 generate` (the docs show `npx`). Without Local Install the component schema is fixed. Use it from the start when any of passkeys, organizations or admin is wanted, since the schema is then project-owned.

### Gaps

- SSO, SCIM, OAuth Provider and MCP are incompatible even with Local Install. If the project needs one of them, choose Clerk or another solution and tell the user. **Verify** that Clerk covers the feature first: the research did not check Clerk for SSO, SCIM, OAuth Provider or MCP.
- Organization, admin and passkey flows were not verified end to end after Local Install. Test each before reporting the feature done.
- If Local Install is not used, an organization and role model must be built by hand in Convex tables.
- No prebuilt UI: sign-in, sign-up, verification, reset, two-factor and account screens are built with the project's UI stack (see [UI](ui.md)).
- Bun-specific notes: none found.

### Identity and app users

In Convex functions use the component's helpers or `ctx.auth.getUserIdentity()` to get the signed-in user (**verify** the helper names against the installed version). Keep a Convex app `users` table linked to the Better Auth user ID for application data; do not put application data in the component's tables.

## Auth and TanStack DB

TanStack DB with Convex is required (see [Convex and TanStack DB](convex-and-db.md)). `@tanstack/convex-db-collection` subscribes to a Convex query and leaves authentication and access control to Convex: reuse the authenticated Convex client from either provider above. The same client must serve the subscription and the mutations.

- **Auth-gated subscription.** Restoring persisted rows needs only the cached user ID, so create the collection and render its local rows from that ID without waiting for Convex (this keeps cached-first loading, rule 6). Gate only the live Convex subscription on `useConvexAuth()` reporting `isAuthenticated`: inference, queries that require an identity fail while unauthenticated. **Verify** with the installed persistence and `@tanstack/convex-db-collection` versions that a collection can render persisted rows before its subscription starts. Authorization stays in the Convex functions, never in client-side filters.
- **Per-user cache scoping.** Put the user ID (Clerk `userId`, or the Better Auth user ID) in every collection `id` and in the persistence database name. [Convex and TanStack DB](convex-and-db.md) asks for one or the other; using both here tightens that rule. Cached-first reload needs the user ID before Convex finishes authenticating: **verify** that Clerk's `userId` or the Better Auth session gives it early enough, and fall back to rendering the loading state for a user whose ID is not yet known rather than reading another user's cache.
- **Sign-out.** Before or as part of signing out: clean up the user's collections (for Query collections `await collection.cleanup({ dependents: true })`, which also stops dependent live queries), delete that user's persisted database, then sign out. Convex collection cleanup does not close the shared Convex client, and a restart soon after cleanup can start from the previous run's rows until the server's next result (documented caveat). Inference: so tear down the Convex client, the collections and their caches together, and build new ones for the next user. A TanStack maintainer suggests keying collections by user or session and cleaning up on error (github.com/TanStack/db discussions 807, an Electric discussion, not official docs). No official clear-on-sign-out recipe for Convex collections was found.
- **Check.** The browser check in [Checks](checks.md) step 5 (sign out, sign in as another user, assert no rows from the first) covers this. If it fails because of the caveats above, report it as a known gap with the reason.

## Unverified

- Clerk's `@clerk/tanstack-react-start` guide at clerk.com/docs, its `<Show>` component, and any `beforeLoad` redirect example.
- Authenticating the server-side Convex client in Start without `@convex-dev/react-query`.
- `@tanstack/convex-db-collection` version and sign-out behavior; `svix` version.
- Better Auth Triggers and Authorization pages; organization, admin and passkey flows after Local Install.
- Clerk's per-feature organization limits and the current pricing.
- Which `convex` version applies: npm snapshots disagree (1.38.0 and 1.46.0 seen); use `^1.0.0`, and Better Auth needs at least 1.25.0.
