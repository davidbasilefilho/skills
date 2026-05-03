---
name: shadcn
description: Manages shadcn components and projects. Add, search, fix, debug, style, and compose UI. Use for shadcn/ui, registry items, presets, `--preset` codes, or any project with `components.json`. Also applies to `shadcn init`, `create an app with --preset`, and `switch to --preset`.
user-invocable: false
allowed-tools: Bash(npx shadcn@latest *), Bash(pnpm dlx shadcn@latest *), Bash(bunx --bun shadcn@latest *)
---

# shadcn/ui

A UI framework for components and design systems. The CLI adds source code to the user's project.

> **IMPORTANT:** Run CLI commands with the project's package runner: `npx shadcn@latest`, `pnpm dlx shadcn@latest`, or `bunx --bun shadcn@latest`, based on `packageManager`. Examples use `npx shadcn@latest`; swap to the project runner.

## Current Project Context

```json
!`npx shadcn@latest info --json`
```

Use the JSON for project config and installed components. Run `npx shadcn@latest docs <component>` for docs and example URLs.

## Principles

1. Use existing components first. Run `npx shadcn@latest search` before custom UI. Check community registries too.
2. Compose, don't reinvent. Settings page = Tabs + Card + form controls. Dashboard = Sidebar + Card + Chart + Table.
3. Use built-in variants before custom styles. `variant="outline"`, `size="sm"`, etc.
4. Use semantic colors. `bg-primary`, `text-muted-foreground` only. No raw values like `bg-blue-500`.

## Critical Rules

These rules are always on. Each links to incorrect and correct examples.

### Styling & Tailwind → [styling.md](./rules/styling.md)

- `className` for layout, not styling. Do not override component colors or typography.
- No `space-x-*` or `space-y-*`. Use `flex` with `gap-*`. For vertical stacks, use `flex flex-col gap-*`.
- Use `size-*` when width and height match. `size-10`, not `w-10 h-10`.
- Use `truncate`. Do not write `overflow-hidden text-ellipsis whitespace-nowrap`.
- No manual `dark:` color overrides. Use semantic tokens like `bg-background` and `text-muted-foreground`.
- Use `cn()` for conditional classes. Do not write manual template ternaries.
- No manual `z-index` on overlay components. Dialog, Sheet, Popover, and similar handle stacking.

### Forms & Inputs → [forms.md](./rules/forms.md)

- Forms use `FieldGroup` + `Field`. Do not use raw `div` with `space-y-*` or `grid gap-*` for form layout.
- `InputGroup` uses `InputGroupInput` and `InputGroupTextarea`. Do not place raw `Input` or `Textarea` inside `InputGroup`.
- Buttons inside inputs use `InputGroup` + `InputGroupAddon`.
- Option sets with 2 to 7 choices use `ToggleGroup`. Do not loop `Button` with manual active state.
- Use `FieldSet` + `FieldLegend` for related checkboxes and radios. Do not use a `div` with a heading.
- Validation uses `data-invalid` on `Field` and `aria-invalid` on the control. For disabled, use `data-disabled` on `Field` and `disabled` on the control.

### Component Structure → [composition.md](./rules/composition.md)

- Items stay inside their group. `SelectItem` → `SelectGroup`. `DropdownMenuItem` → `DropdownMenuGroup`. `CommandItem` → `CommandGroup`.
- Use `asChild` for radix or `render` for base when making custom triggers. Check `base` in `npx shadcn@latest info`. → [base-vs-radix.md](./rules/base-vs-radix.md)
- Dialog, Sheet, and Drawer need a Title. Use `DialogTitle`, `SheetTitle`, or `DrawerTitle`. Hide with `className="sr-only"` if needed.
- Use full Card composition: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
- Button has no `isPending` or `isLoading`. Compose with `Spinner` + `data-icon` + `disabled`.
- `TabsTrigger` must stay inside `TabsList`.
- `Avatar` needs `AvatarFallback`.

### Use Components, Not Custom Markup → [composition.md](./rules/composition.md)

- Use existing components before custom markup. Check if a component exists before writing a styled `div`.
- Callouts use `Alert`.
- Empty states use `Empty`.
- Toasts use `sonner` and `toast()`.
- Use `Separator` instead of `<hr>` or `<div className="border-t">`.
- Use `Skeleton` for loading placeholders. No custom `animate-pulse` divs.
- Use `Badge` instead of custom styled spans.

### Icons → [icons.md](./rules/icons.md)

- Icons in `Button` use `data-icon`, either `inline-start` or `inline-end`.
- Do not size icons inside components. Components handle icon sizing. No `size-4` or `w-4 h-4`.
- Pass icons as objects, not string keys. `icon={CheckIcon}`, not a string lookup.

### CLI

- Never decode preset codes or build preset URLs manually. Use `preset decode`, `preset url`, or `preset open`. For project-aware detection, use `preset resolve`.
- Apply preset codes directly with the CLI. Use `apply <code>` for existing projects, or `init --preset <code>` when initializing.

## Key Patterns

```tsx
// Form layout: FieldGroup + Field, not div + Label.
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" />
  </Field>
</FieldGroup>

// Validation: data-invalid on Field, aria-invalid on the control.
<Field data-invalid>
  <FieldLabel>Email</FieldLabel>
  <Input aria-invalid />
  <FieldDescription>Invalid email.</FieldDescription>
</Field>

// Icons in buttons: data-icon, no sizing classes.
<Button>
  <SearchIcon data-icon="inline-start" />
  Search
</Button>

// Spacing: gap-*, not space-y-*.
<div className="flex flex-col gap-4">  // correct
<div className="space-y-4">           // wrong

// Equal dimensions: size-*, not w-* h-*.
<Avatar className="size-10">   // correct
<Avatar className="w-10 h-10"> // wrong

// Status colors: Badge variants or semantic tokens, not raw colors.
<Badge variant="secondary">+20.1%</Badge>    // correct
<span className="text-emerald-600">+20.1%</span> // wrong
```

## Component Selection

| Need                       | Use                                                                                                 |
| -------------------------- | --------------------------------------------------------------------------------------------------- |
| Button/action              | `Button` with appropriate variant                                                                   |
| Form inputs                | `Input`, `Select`, `Combobox`, `Switch`, `Checkbox`, `RadioGroup`, `Textarea`, `InputOTP`, `Slider` |
| Toggle between 2–5 options | `ToggleGroup` + `ToggleGroupItem`                                                                   |
| Data display               | `Table`, `Card`, `Badge`, `Avatar`                                                                  |
| Navigation                 | `Sidebar`, `NavigationMenu`, `Breadcrumb`, `Tabs`, `Pagination`                                     |
| Overlays                   | `Dialog` (modal), `Sheet` (side panel), `Drawer` (bottom sheet), `AlertDialog` (confirmation)       |
| Feedback                   | `sonner` (toast), `Alert`, `Progress`, `Skeleton`, `Spinner`                                        |
| Command palette            | `Command` inside `Dialog`                                                                           |
| Charts                     | `Chart` (wraps Recharts)                                                                            |
| Layout                     | `Card`, `Separator`, `Resizable`, `ScrollArea`, `Accordion`, `Collapsible`                          |
| Empty states               | `Empty`                                                                                             |
| Menus                      | `DropdownMenu`, `ContextMenu`, `Menubar`                                                            |
| Tooltips/info              | `Tooltip`, `HoverCard`, `Popover`                                                                   |

## Key Fields

Injected project context fields:

- `aliases` means use the real alias prefix for imports, never hardcode.
- `isRSC` means components with `useState`, `useEffect`, handlers, or browser APIs need `"use client"`.
- `tailwindVersion` means `v4` uses `@theme inline` and `v3` uses `tailwind.config.js`.
- `tailwindCssFile` is the global CSS file for custom CSS variables. Edit this file, never create a new one.
- `style` is the component visual treatment, like `nova` or `vega`.
- `base` is the primitive library, `radix` or `base`. It affects APIs and props.
- `iconLibrary` controls icon imports. Use `lucide-react` for `lucide`, `@tabler/icons-react` for `tabler`, and so on.
- `resolvedPaths` gives exact file destinations for components, utils, hooks, and more.
- `framework` covers routing and file conventions, such as Next.js App Router or Vite SPA.
- `packageManager` is the runner for non-shadcn installs, such as `pnpm add date-fns`.
- `preset` is the resolved preset code and values for the current project. Use `preset resolve --json` for details.

See [cli.md — `info` command](./cli.md) for the full field reference.

## Component Docs, Examples, and Usage

Run `npx shadcn@latest docs <component>` to get docs, examples, and API URLs. Fetch those URLs for actual content.

```bash
npx shadcn@latest docs button dialog select
```

When creating, fixing, debugging, or using a component, always run `npx shadcn@latest docs` and fetch the URLs first. That keeps API usage correct.

## Workflow

1. Get project context. It is already injected above. Run `npx shadcn@latest info` if you need a refresh.
2. Check installed components first. Before `add`, check the `components` list from context or list `resolvedPaths.ui`. Do not import missing components and do not re-add installed ones.
3. Find components. Use `npx shadcn@latest search`.
4. Get docs and examples. Run `npx shadcn@latest docs <component>`, then fetch the URLs. Use `npx shadcn@latest view` for registry items not yet installed. Use `npx shadcn@latest add --diff` to preview changes on installed components.
5. Install or update. Use `npx shadcn@latest add`. When updating, use `--dry-run` and `--diff` first.
6. Fix imports in third-party components. After adding components from community registries like `@bundui` or `@magicui`, inspect added non-UI files for hardcoded `@/components/ui/...` imports. Rewrite them to match the project's alias from `npx shadcn@latest info`, such as `@workspace/ui/components`.
7. Review added components. After adding a component or block, always read the added files and verify them. Check for missing subcomponents, missing imports, bad composition, or Critical Rule violations. Replace icon imports with the project `iconLibrary` if needed. Fix issues before moving on.
8. Registry must be explicit. If the user asks to add a block or component and does not name a registry, ask which registry to use.
9. Switching presets. Ask first: overwrite, partial, merge, or skip?
   - Inspect current preset: `npx shadcn@latest preset resolve`. Use `--json` for structured values.
   - Inspect incoming preset: `npx shadcn@latest preset decode <code>`. Use `preset url <code>` or `preset open <code>` to share or open the builder.
   - Overwrite: `npx shadcn@latest apply <code>`.
   - Partial: `npx shadcn@latest apply <code> --only theme,font`. Supported values are `theme` and `font`.
   - Merge: `npx shadcn@latest init --preset <code> --force --no-reinstall`, then run `npx shadcn@latest info` and smart merge each installed component with `--dry-run` and `--diff`.
   - Skip: `npx shadcn@latest init --preset <code> --force --no-reinstall`. Updates config and CSS only.
   - Always run preset commands in the user's project directory. `apply` works only in an existing project with `components.json`. The CLI preserves the current base from `components.json`. If using a scratch dir for `--dry-run`, pass `--base <current-base>` explicitly.

## Updating Components

When updating upstream while keeping local changes, use `--dry-run` and `--diff` for a smart merge. Never fetch raw files from GitHub manually.

1. Run `npx shadcn@latest add <component> --dry-run` to see affected files.
2. For each file, run `npx shadcn@latest add <component> --diff <file>` to compare upstream and local.
3. Decide per file:
   - No local changes: overwrite safely.
   - Has local changes: read the local file, analyze the diff, and apply upstream updates while keeping local changes.
   - User says update everything: use `--overwrite`, but confirm first.
4. Never use `--overwrite` without explicit approval.

## Quick Reference

```bash
# Create a new project.
npx shadcn@latest init --name my-app --preset base-nova
npx shadcn@latest init --name my-app --preset a2r6bw --template vite

# Create a monorepo project.
npx shadcn@latest init --name my-app --preset base-nova --monorepo
npx shadcn@latest init --name my-app --preset base-nova --template next --monorepo

# Initialize existing project.
npx shadcn@latest init --preset base-nova
npx shadcn@latest init --defaults  # shortcut: --template=next --preset=nova (base style implied)

# Apply a preset to an existing project.
npx shadcn@latest apply a2r6bw
npx shadcn@latest apply a2r6bw --only theme
npx shadcn@latest apply a2r6bw --only font
npx shadcn@latest apply a2r6bw --only theme,font

# Inspect preset codes and project preset state.
npx shadcn@latest preset decode a2r6bw
npx shadcn@latest preset url a2r6bw
npx shadcn@latest preset open a2r6bw
npx shadcn@latest preset resolve
npx shadcn@latest preset resolve --json

# Add components.
npx shadcn@latest add button card dialog
npx shadcn@latest add @magicui/shimmer-button
npx shadcn@latest add --all

# Preview changes before adding/updating.
npx shadcn@latest add button --dry-run
npx shadcn@latest add button --diff button.tsx
npx shadcn@latest add @acme/form --view button.tsx

# Search registries.
npx shadcn@latest search @shadcn -q "sidebar"
npx shadcn@latest search @tailark -q "stats"

# Get component docs and example URLs.
npx shadcn@latest docs button dialog select

# View registry item details for items not yet installed.
npx shadcn@latest view @shadcn/button
```

**Named presets:** `nova`, `vega`, `maia`, `lyra`, `mira`, `luma`
**Templates:** `next`, `vite`, `start`, `react-router`, `astro` all support `--monorepo`, and `laravel` does not.
**Preset codes:** Version-prefixed base62 strings like `a2r6bw` or `b0`, from [ui.shadcn.com](https://ui.shadcn.com).

## Detailed References

- [rules/forms.md](./rules/forms.md) - FieldGroup, Field, InputGroup, ToggleGroup, FieldSet, validation states
- [rules/composition.md](./rules/composition.md) - Groups, overlays, Card, Tabs, Avatar, Alert, Empty, Toast, Separator, Skeleton, Badge, Button loading
- [rules/icons.md](./rules/icons.md) - data-icon, icon sizing, passing icons as objects
- [rules/styling.md](./rules/styling.md) - semantic colors, variants, className, spacing, size, truncate, dark mode, cn(), z-index
- [rules/base-vs-radix.md](./rules/base-vs-radix.md) - asChild vs render, Select, ToggleGroup, Slider, Accordion
- [cli.md](./cli.md) - Commands, flags, presets, templates
- [customization.md](./customization.md) - Theming, CSS variables, extending components
