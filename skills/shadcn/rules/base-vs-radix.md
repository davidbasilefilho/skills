# Base vs Radix

Check `base` in `npx shadcn@latest info`.

## Key Differences

- Radix uses `asChild`. Base uses `render`.
- Base needs `nativeButton={false}` when `render` changes a button to a non-button element.
- Select differs by `items`, placeholder handling, positioning, and object values.
- ToggleGroup differs by `type` vs `multiple` and by `defaultValue` shape.
- Slider uses a number for single thumb in base. Radix uses an array.
- Accordion uses `multiple` in base. Radix uses `type="single"` or `type="multiple"`.

## Examples

```tsx
<DialogTrigger asChild>
  <Button>Open</Button>
</DialogTrigger>

<DialogTrigger render={<Button />}>Open</DialogTrigger>
```

```tsx
<Button render={<a href="/docs" />} nativeButton={false}>
  Read the docs
</Button>

<Button asChild>
  <a href="/docs">Read the docs</a>
</Button>
```

```tsx
<Select items={items}>
  <SelectTrigger><SelectValue /></SelectTrigger>
</Select>

<Select>
  <SelectTrigger><SelectValue placeholder="Select a fruit" /></SelectTrigger>
</Select>
```

```tsx
<ToggleGroup defaultValue={["daily"]} spacing={2}>
  <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
</ToggleGroup>

<ToggleGroup type="single" defaultValue="daily" spacing={2}>
  <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
</ToggleGroup>
```

```tsx
<Slider defaultValue={50} max={100} step={1} />
<Slider defaultValue={[50]} max={100} step={1} />
```

```tsx
<Accordion defaultValue={["item-1"]}>
  <AccordionItem value="item-1">...</AccordionItem>
</Accordion>

<Accordion type="single" collapsible defaultValue="item-1">
  <AccordionItem value="item-1">...</AccordionItem>
</Accordion>
```
