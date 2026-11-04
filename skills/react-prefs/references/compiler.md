# React Compiler

Source: react.dev React Compiler docs (1.0 stable, announced 2025-10-07), bundler docs and linter docs, as of 2026-11-04. Versions and options move quickly: check current docs with web search or fetch before pinning anything. Package at research time: `babel-plugin-react-compiler` (1.0.0 seen; newest 1.x unconfirmed).

## Rule

Always enable the Compiler in a React project. The only exception is a bundler or platform that cannot support it. In that case say so, record the reason (see the waiver in [Checks](checks.md)), and re-check at each dependency upgrade (`upgrade-deps`).

## Setup per bundler

- **Babel**: `babel-plugin-react-compiler` must be first in the plugin list.
- **Vite**: with `@vitejs/plugin-react` 6 or newer, use `react()` plus `babel({ presets: [reactCompilerPreset()] })` from `@rolldown/plugin-babel`. Before plugin-react 6: `react({ babel: { plugins: ['babel-plugin-react-compiler'] } })`. A Rust path (`react({ compiler: true })`, preliminary) is reported only in secondary sources: verify in the plugin's own docs before use.
- **Next.js**: install `babel-plugin-react-compiler`, set `reactCompiler: true` in the Next config (stable top-level option since 16.0.0; earlier `experimental.reactCompiler`). `reactCompiler: { compilationMode: 'annotation' }` is supported.
- **React Router**: `vite-plugin-babel` with the compiler plugin and a `filter`.
- **Webpack**: community loader `react-compiler-webpack`.
- **Rsbuild**: 2.1.0 or newer: `pluginReact({ reactCompiler: true })`. For React 17 or 18 add `reactCompiler: { target: '18' }`. The alternative is `@rsbuild/plugin-babel`.
- **Rspack**: follow Rspack's own docs.
- **TanStack Start**: on Vite use the standard Vite setup above, on Rsbuild use `pluginReact({ reactCompiler: true })` and remove the Babel plugin. No official TanStack page was found; test the build and the dev server. An old compiler version (`rc.2`) caused a 500 error in a reported case, so use a current version.
- **Expo / Metro**: SDK 54 or newer configures Babel automatically; enable with `"experiments": { "reactCompiler": true }`. Lint rules ship in `eslint-config-expo` from SDK 55.
- **Bun**: no official React or Bun doc was found. A third-party plugin `bun-plugin-react-compiler` exists, and secondary sources report an experimental built-in `Bun.build({ reactCompiler: true })`. Both are unconfirmed: check Bun's own docs first. If neither works for the project, the bundler exception applies, or use Vite for the browser bundle (see the Vite setup above).

## Unsupported targets

No official page lists bundlers that cannot use the Compiler. It is Babel based, with swc and oxc support in progress. A bundler with no Babel hook and no native integration cannot use it (inference): check that bundler's docs. The `syntax` compilationMode needs Flow and does not work with TypeScript.

## Best practices (always adhere)

1. **Follow the Rules of React**: no mutation during render, no impure render, no ref reads or writes during render. The lint rules `immutability`, `purity`, `refs`, `set-state-in-render` and `set-state-in-effect` enforce them.
2. **Lint with the compiler rules**: install `eslint-plugin-react-hooks` and use `reactHooks.configs.flat.recommended` (the `recommended-latest` preset adds newer experimental rules). The standalone `eslint-plugin-react-compiler` is superseded: remove it. The linter does not need the compiler installed. With Oxlint 1.79.0 or newer there are per-category React Compiler rules (recent: re-check before relying on them; `config` and `gating` are not implemented).
3. **Violations are skipped silently**: the compiler skips a component or hook that breaks a rule and does not fail the build. So lint errors on these rules must fail CI.
4. **Memoization**: in new code do not hand-write `useMemo`, `useCallback` or `memo`; rely on the compiler. Keep them only as an escape hatch, mainly for values used as Effect dependencies. In existing code leave memoization in place or test carefully before removing it, since removal can change compiler output.
5. **Only components and hooks are memoized**, not arbitrary functions.
6. **`compilationMode`**: keep the default `infer`. Use `annotation` (compiles only `"use memo"` functions) for incremental adoption. Never use `all` (not recommended). `syntax` is Flow only.
7. **`"use no memo"`** is a temporary escape hatch at function or file level. It must be the first statement, with quotes not backticks, and overrides every mode. Always add a comment saying why and plan its removal.
8. **Incremental adoption** in an existing codebase: Babel `overrides` by directory, annotation mode, or `gating` feature flags.
9. **React 17 and 18**: set `target: '17'` or `'18'` and install `react-compiler-runtime` as a runtime dependency, not a dev one. React 19 needs neither.
10. **Keep the compiler version steady** when the project lacks end-to-end tests, because memoization changes can alter Effect firing. Declare it as a zeroed caret range (for example `^1.0.0`, per `bun-prefs`) and let the lockfile fix the exact version. Move it only in a deliberate upgrade followed by a test run.
11. **Verify it ran**: the React DevTools "Memo" badge on compiled components. `react-compiler-healthcheck` appears only in the Expo docs.

## Interaction with other rules

Activity cleanup and ViewTransition callbacks are Effects and refs: keep them compiler-safe (cleanups returned, no ref access in render). See [Activity](activity.md).
