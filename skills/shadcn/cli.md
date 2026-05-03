# shadcn CLI Reference

Configuration comes from `components.json`.

> **IMPORTANT:** Run commands with the project's package runner: `npx shadcn@latest`, `pnpm dlx shadcn@latest`, or `bunx --bun shadcn@latest`. Use the runner that matches `packageManager`. Examples use `npx shadcn@latest`.
> **IMPORTANT:** Only use documented flags. Do not invent flags. The CLI auto-detects package manager from the lockfile, so there is no `--package-manager` flag.

## Commands

### `init` - Initialize or create a project

```bash
npx shadcn@latest init [components...] [options]
```

Creates or initializes a shadcn/ui project. Can install components at the same time.

| Flag | Short | Description | Default |
| --- | --- | --- | --- |
| `--template <template>` | `-t` | Template (`next`, `start`, `vite`, `next-monorepo`, `react-router`) | - |
| `--preset [name]` | `-p` | Preset config (`named`, `code`, or `URL`) | - |
| `--yes` | `-y` | Skip prompt | `true` |
| `--defaults` | `-d` | Use defaults (`--template=next --preset=base-nova`) | `false` |
| `--force` | `-f` | Overwrite existing config | `false` |
| `--cwd <cwd>` | `-c` | Working directory | current |
| `--name <name>` | `-n` | New project name | - |
| `--silent` | `-s` | Mute output | `false` |
| `--rtl` |  | Enable RTL | - |
| `--reinstall` |  | Re-install existing UI components | `false` |
| `--monorepo` |  | Scaffold monorepo | - |
| `--no-monorepo` |  | Skip monorepo prompt | - |

`npx shadcn@latest create` aliases `init`.

### `apply` - Apply a preset

```bash
npx shadcn@latest apply [preset] [options]
```

Applies a preset to an existing project and overwrites preset-driven config, fonts, CSS variables, and detected UI components.

| Flag | Short | Description | Default |
| --- | --- | --- | --- |
| `--preset <preset>` | - | Preset config (`named`, `code`, or `URL`) | - |
| `--yes` | `-y` | Skip prompt | `false` |
| `--cwd <cwd>` | `-c` | Working directory | current |
| `--silent` | `-s` | Mute output | `false` |

`[preset]` is shorthand for `--preset <preset>`. If both exist, they must match. If no preset is given, the CLI opens the custom preset builder on `ui.shadcn.com/create`.

### `add` - Add components

> **IMPORTANT:** To compare local components against upstream or preview changes, always use `npx shadcn@latest add <component> --dry-run`, `--diff`, or `--view`. Never fetch raw files from GitHub or other sources by hand.

```bash
npx shadcn@latest add [components...] [options]
```

Accepts component names, registry names like `@magicui/shimmer-button`, URLs, or local paths.

| Flag | Short | Description | Default |
| --- | --- | --- | --- |
| `--yes` | `-y` | Skip prompt | `false` |
| `--overwrite` | `-o` | Overwrite files | `false` |
| `--cwd <cwd>` | `-c` | Working directory | current |
| `--all` | `-a` | Add all components | `false` |
| `--path <path>` | `-p` | Target path | - |
| `--silent` | `-s` | Mute output | `false` |
| `--dry-run` |  | Preview changes without writing | `false` |
| `--diff [path]` |  | Show diffs. No path shows first 5 files. With path shows only that file. Implies `--dry-run` | - |
| `--view [path]` |  | Show file contents. No path shows first 5 files. With path shows only that file. Implies `--dry-run` | - |

Use `--dry-run` to preview changes. Use `--diff` for local vs upstream diffs. Use `--view` to inspect source without installing. Use `--diff globals.css` for CSS changes. Prefer `add --dry-run/--diff/--view` over `view` when previewing project changes. `view` only shows raw registry metadata.

See [Updating Components in SKILL.md](./SKILL.md#updating-components) for smart merge workflow.

### `search` - Search registries

```bash
npx shadcn@latest search <registries...> [options]
```

Fuzzy search across registries. Aliased as `list`. Without `-q`, lists all items.

| Flag | Short | Description | Default |
| --- | --- | --- | --- |
| `--query <query>` | `-q` | Search query | - |
| `--limit <number>` | `-l` | Max items per registry | `100` |
| `--offset <number>` | `-o` | Items to skip | `0` |
| `--cwd <cwd>` | `-c` | Working directory | current |

### `view` - View item details

```bash
npx shadcn@latest view <items...> [options]
```

Shows item info and file contents. Example: `npx shadcn@latest view @shadcn/button`.

### `docs` - Get documentation URLs

```bash
npx shadcn@latest docs <components...> [options]
```

Returns docs, examples, and API URLs. Fetch those URLs for actual content.

Example:

```bash
npx shadcn@latest docs input button
```

Some components also include an `api` link for the underlying library.

### `diff` - Check for updates

Do not use this command. Use `npx shadcn@latest add --diff` instead.

### `info` - Project information

```bash
npx shadcn@latest info [options]
```

Shows project info and `components.json`. Run this first to discover framework, aliases, Tailwind version, and resolved paths.

| Flag | Short | Description | Default |
| --- | --- | --- | --- |
| `--cwd <cwd>` | `-c` | Working directory | current |

`info` fields:

| Field | Type | Meaning |
| --- | --- | --- |
| `framework` | `string` | Framework (`next`, `vite`, `react-router`, `start`, etc.) |
| `frameworkVersion` | `string` | Framework version |
| `isSrcDir` | `boolean` | Uses `src/` dir |
| `isRSC` | `boolean` | React Server Components enabled |
| `isTsx` | `boolean` | Uses TypeScript |
| `tailwindVersion` | `string` | `v3` or `v4` |
| `tailwindConfigFile` | `string` | Tailwind config path |
| `tailwindCssFile` | `string` | Global CSS path |
| `aliasPrefix` | `string` | Import alias prefix |
| `packageManager` | `string` | `npm`, `pnpm`, `yarn`, or `bun` |

`components.json` fields:

| Field | Type | Meaning |
| --- | --- | --- |
| `base` | `string` | `radix` or `base` |
| `style` | `string` | Visual style |
| `rsc` | `boolean` | RSC flag |
| `tsx` | `boolean` | TypeScript flag |
| `tailwind.config` | `string` | Tailwind config path |
| `tailwind.css` | `string` | Global CSS path |
| `iconLibrary` | `string` | Icon package |
| `aliases.components` | `string` | Components alias |
| `aliases.utils` | `string` | Utils alias |
| `aliases.ui` | `string` | UI alias |
| `aliases.lib` | `string` | Lib alias |
| `aliases.hooks` | `string` | Hooks alias |
| `resolvedPaths` | `object` | Absolute paths |
| `registries` | `object` | Custom registries |

`info` also includes `Links` with templated URLs. For resolved URLs, use `docs <component>`.

### `build` - Build a custom registry

```bash
npx shadcn@latest build [registry] [options]
```

Builds `registry.json` into distributable JSON files. Default input `./registry.json`, default output `./public/r`.

| Flag | Short | Description | Default |
| --- | --- | --- | --- |
| `--output <path>` | `-o` | Output directory | `./public/r` |
| `--cwd <cwd>` | `-c` | Working directory | current |

## Templates

| Value | Framework | Monorepo support |
| --- | --- | --- |
| `next` | Next.js | Yes |
| `vite` | Vite | Yes |
| `start` | TanStack Start | Yes |
| `react-router` | React Router | Yes |
| `astro` | Astro | Yes |
| `laravel` | Laravel | No |

All templates support monorepo scaffolding via `--monorepo`. If neither `--monorepo` nor `--no-monorepo` is passed, the CLI prompts. Laravel does not support monorepo scaffolding.

## Presets

Three preset forms:

1. Named: `--preset nova` or `--preset lyra`
2. Code: `--preset a2r6bw`
3. URL: `--preset "https://ui.shadcn.com/init?base=radix&style=nova&..."`

> **IMPORTANT:** Preset codes are opaque. Do not decode, fetch, or resolve them manually. Pass them to `init --preset <code>` and let the CLI handle resolution.
> Use `apply --preset <code>` when overwriting an existing preset.

## Switching Presets

Ask first: **overwrite**, **merge**, or **skip** existing components?

- **Overwrite / Re-install** → `npx shadcn@latest apply --preset <code>`.
- **Merge** → `npx shadcn@latest init --preset <code> --force --no-reinstall`, then run `npx shadcn@latest info` and smart merge each component one by one.
- **Skip** → `npx shadcn@latest init --preset <code> --force --no-reinstall`.

Always run preset commands in the user's project directory. `apply` only works in an existing project with `components.json`. The CLI preserves the current base from `components.json`. If using a scratch dir, pass `--base <current-base>` explicitly because preset codes do not encode base.
