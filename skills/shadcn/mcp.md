# shadcn MCP Server

The CLI includes an MCP server for registry search, browsing, and install flows.

## Setup

```bash
shadcn mcp
shadcn mcp init
```

Editor configs:

| Editor | Config file |
| --- | --- |
| Claude Code | `.mcp.json` |
| Cursor | `.cursor/mcp.json` |
| VS Code | `.vscode/mcp.json` |
| OpenCode | `opencode.json` |
| Codex | `~/.codex/config.toml` |

## Tools

> **Tip:** MCP tools handle registry operations. For project config like aliases, framework, and Tailwind version, use `npx shadcn@latest info`.

- `shadcn:get_project_registries` - registry names from `components.json`
- `shadcn:list_items_in_registries` - list items in registries
- `shadcn:search_items_in_registries` - fuzzy search
- `shadcn:view_items_in_registries` - view item details and file contents
- `shadcn:get_item_examples_from_registries` - usage examples and demos
- `shadcn:get_add_command_for_items` - install command
- `shadcn:get_audit_checklist` - import, dependency, lint, TypeScript checklist

## Configuring Registries

Registries live in `components.json`. `@shadcn` is built in.

```json
{
  "registries": {
    "@acme": "https://acme.com/r/{name}.json",
    "@private": {
      "url": "https://private.com/r/{name}.json",
      "headers": { "Authorization": "Bearer ${MY_TOKEN}" }
    }
  }
}
```

- Names must start with `@`.
- URLs must contain `{name}`.
- `${VAR}` comes from environment variables.

Community registry index: `https://ui.shadcn.com/r/registries.json`
