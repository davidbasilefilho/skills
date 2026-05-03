# Customization & Theming

Components use semantic CSS variables. Change variables to change every component.

## How It Works

1. Define CSS vars in `:root` and `.dark`.
2. Tailwind maps them to utilities like `bg-primary` and `text-muted-foreground`.
3. Components consume those utilities, so one var change updates all consumers.

## Color Variables

Use `name` and `name-foreground` pairs. Base var is the background. `-foreground` is text/icons on that background.

| Variable | Purpose |
| --- | --- |
| `--background` / `--foreground` | Page background and default text |
| `--card` / `--card-foreground` | Card surfaces |
| `--primary` / `--primary-foreground` | Primary actions |
| `--secondary` / `--secondary-foreground` | Secondary actions |
| `--muted` / `--muted-foreground` | Muted and disabled states |
| `--accent` / `--accent-foreground` | Hover and accent states |
| `--destructive` / `--destructive-foreground` | Errors and destructive actions |
| `--border` | Default border color |
| `--input` | Input borders |
| `--ring` | Focus ring |
| `--chart-1` to `--chart-5` | Chart colors |
| `--sidebar-*` | Sidebar colors |
| `--surface` / `--surface-foreground` | Secondary surface |

Colors use OKLCH, for example `--primary: oklch(0.205 0 0)`.

## Dark Mode

Use class-based dark mode with `.dark` on the root. In Next.js, use `next-themes`:

```tsx
import { ThemeProvider } from "next-themes"

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

## Changing the Theme

```bash
npx shadcn@latest apply --preset a2r6bw
npx shadcn@latest apply a2r6bw
npx shadcn@latest apply --preset nova
npx shadcn@latest init --preset nova --force --no-reinstall
npx shadcn@latest apply --preset "https://ui.shadcn.com/init?base=radix&style=nova&theme=blue&..."
```

Or edit CSS variables directly in `globals.css`.

## Adding Custom Colors

Add vars to `tailwindCssFile` from `npx shadcn@latest info`. Do not create a new CSS file.

```css
:root {
  --warning: oklch(0.84 0.16 84);
  --warning-foreground: oklch(0.28 0.07 46);
}
.dark {
  --warning: oklch(0.41 0.11 46);
  --warning-foreground: oklch(0.99 0.02 95);
}
```

Tailwind v4:

```css
@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}
```

Tailwind v3:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        warning: "oklch(var(--warning) / <alpha-value>)",
        "warning-foreground": "oklch(var(--warning-foreground) / <alpha-value>)",
      },
    },
  },
}
```

Use it in components:

```tsx
<div className="bg-warning text-warning-foreground">Warning</div>
```

## Border Radius

`--radius` controls border radius globally. `rounded-lg` and `rounded-md` derive from it.

## Customizing Components

1. Built-in variants.
2. `className` for layout.
3. Add a new variant in the component source.
4. Wrapper components for higher-level composition.

## Checking for Updates

```bash
npx shadcn@latest add button --diff
npx shadcn@latest add button --dry-run
npx shadcn@latest add button --diff button.tsx
```

Use `--dry-run` and `--diff` before updating.

See [Updating Components in SKILL.md](./SKILL.md#updating-components).
