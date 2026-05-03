# Forms & Inputs

## Rules

- Use `FieldGroup` + `Field` for forms.
- Use `InputGroupInput` and `InputGroupTextarea` inside `InputGroup`.
- Use `InputGroup` + `InputGroupAddon` for buttons inside inputs.
- Use `ToggleGroup` for 2 to 7 options.
- Use `FieldSet` + `FieldLegend` for grouped checkboxes or radios.
- Use `data-invalid` and `data-disabled` on the field. Use `aria-invalid` or `disabled` on the control.

## Examples

```tsx
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" type="email" />
  </Field>
</FieldGroup>
```

```tsx
<Field orientation="horizontal">
  <FieldLabel className="sr-only">Search</FieldLabel>
  <InputGroup>
    <InputGroupInput placeholder="Search..." />
  </InputGroup>
</Field>
```

```tsx
<InputGroup>
  <InputGroupInput placeholder="Search..." />
  <InputGroupAddon>
    <Button size="icon">
      <SearchIcon data-icon="inline-start" />
    </Button>
  </InputGroupAddon>
</InputGroup>
```

```tsx
<ToggleGroup defaultValue={["daily"]} spacing={2}>
  <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
  <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
</ToggleGroup>
```

```tsx
<FieldSet>
  <FieldLegend variant="label">Preferences</FieldLegend>
  <FieldGroup className="gap-3">
    <Field orientation="horizontal">
      <Checkbox id="dark" />
      <FieldLabel htmlFor="dark" className="font-normal">Dark mode</FieldLabel>
    </Field>
  </FieldGroup>
</FieldSet>
```

```tsx
<Field data-invalid>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" aria-invalid />
  <FieldDescription>Invalid email address.</FieldDescription>
</Field>

<Field data-disabled>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" disabled />
</Field>
```
