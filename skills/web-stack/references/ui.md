# UI

Research date: 2026-11-04. Verify versions against current docs.

## Base UI

- Package `@base-ui/react` (the old `@base-ui-components/react` is deprecated). Stable: 1.0.0 shipped 2025-12-11; v1.9.0 on 2026-10-09 was the latest seen.
- Docs: https://base-ui.com/react/overview/quick-start.
- Use Base UI primitives for interactive components (dialogs, menus, selects, tabs, tooltips and so on); style them with Tailwind. Combine with `react-prefs`: show/hide through Activity where it fits, and animate with ViewTransition.

## Tailwind CSS

- Tailwind v4 with Vite: install `tailwindcss @tailwindcss/vite`, add `tailwindcss()` to the Vite plugins, and put `@import "tailwindcss";` in the CSS. Docs: https://tailwindcss.com/docs/installation/using-vite. The current version number was not confirmed.
- Other bundlers: follow the installation page for that bundler.

## cn

- Use the `cn` package (`cn` on npm, from the shadcn-ui org): a drop-in replacement for `twMerge(clsx(...))` with zero dependencies, for Tailwind v4 only. Import it as `import { cn } from "cn"` everywhere; do not hand-write a `cn` that wraps `clsx` and `tailwind-merge`.
- Since September 2026 shadcn components import `cn` from `"cn"` and `lib/utils.ts` is `export { cn } from "cn"`. A project that already has the classic helper migrates with `shadcn@latest migrate cn` (via the project's package runner).
- On Tailwind v3 the package's repo says to stay with tailwind-merge v2. Prefer Tailwind v4 for new projects.
- Interpretation note: the research assumed the user means this `cn` package. If the project already settled on another helper, tell the user before changing it.

## shadcn/ui (opt-in)

shadcn/ui is used only if the user wants it. Ask the user once per project, with a structured question tool when available and a plain question otherwise (for example: "Use shadcn/ui on top of Base UI and Tailwind? 1. Yes 2. No"). Do not install it before the user says yes, and do not ask again once answered.

If yes:

- shadcn/ui made Base UI the default for new projects in July 2026; Radix remains selectable with `shadcn init -b radix`. Keep Base UI (do not pick Radix) so the stack stays consistent.
- Verify the init command and flags in the current shadcn docs (https://ui.shadcn.com/docs/installation) before running them.
