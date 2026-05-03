# Icons

Use the project's configured `iconLibrary` for imports. Do not assume `lucide-react`.

## Rules

- Icons in `Button` use `data-icon="inline-start"` or `data-icon="inline-end"`.
- Do not size icons inside shadcn components unless the user asks for custom sizes.
- Pass icons as component objects, not string keys.

## Examples

```tsx
<Button>
  <SearchIcon data-icon="inline-start" />
  Search
</Button>

<Button>
  Next
  <ArrowRightIcon data-icon="inline-end" />
</Button>
```

```tsx
<Button>
  <SearchIcon data-icon="inline-start" />
  Search
</Button>

<DropdownMenuItem>
  <SettingsIcon />
  Settings
</DropdownMenuItem>
```

```tsx
import { CheckIcon } from "lucide-react"

function StatusBadge({ icon: Icon }: { icon: React.ComponentType }) {
  return <Icon />
}

<StatusBadge icon={CheckIcon} />
```
