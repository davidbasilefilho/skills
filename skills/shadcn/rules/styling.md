# Styling & Customization

See [customization.md](../customization.md) for theming, CSS variables, and custom colors.

## Core Rules

- Use semantic colors. Prefer `bg-primary` and `text-muted-foreground` over raw color values.
- Use built-in variants first.
- Use `className` for layout only, not to override component styling.
- Avoid `space-x-*` and `space-y-*`. Use `gap-*`.
- Use `size-*` when width and height match.
- Use `truncate` instead of long overflow combo.
- Do not add manual `dark:` overrides. Use semantic tokens.
- Use `cn()` for conditional classes.
- Do not set `z-index` manually on overlay components.

## Examples

```tsx
<div className="bg-primary text-primary-foreground">
  <p className="text-muted-foreground">Secondary text</p>
</div>
```

```tsx
<Badge variant="secondary">+20.1%</Badge>
<span className="text-destructive">-3.2%</span>
```

```tsx
<Button variant="outline">Click me</Button>
<Card className="max-w-md mx-auto">
  <CardContent>Dashboard</CardContent>
</Card>
```

```tsx
<div className="flex flex-col gap-4">
  <Input />
  <Input />
  <Button>Submit</Button>
</div>
```

```tsx
<Avatar className="size-10" />
```

```tsx
<div className={cn("flex items-center", isActive ? "bg-primary text-primary-foreground" : "bg-muted")}>
```

## Overlay Rules

`Dialog`, `Sheet`, `Drawer`, `AlertDialog`, `DropdownMenu`, `Popover`, `Tooltip`, and `HoverCard` manage stacking. Do not add `z-50` or similar.
