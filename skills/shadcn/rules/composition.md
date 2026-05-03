# Component Composition

## Rules

- Items stay inside their group component.
- Use `Alert` for callouts.
- Use `Empty` for empty states.
- Use `sonner` for toasts.
- Use `Dialog`, `Sheet`, `Drawer`, `HoverCard`, or `Popover` by intent.
- `Dialog`, `Sheet`, and `Drawer` always need a title.
- Use full `Card` composition.
- `Button` has no `isPending` or `isLoading` prop.
- `TabsTrigger` must stay inside `TabsList`.
- `Avatar` needs `AvatarFallback`.
- Use `Separator` instead of raw `<hr>` or border divs.
- Use `Skeleton` for loading placeholders.
- Use `Badge` instead of custom spans.

## Examples

```tsx
<SelectContent>
  <SelectGroup>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
  </SelectGroup>
</SelectContent>
```

```tsx
<Alert>
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>Something needs attention.</AlertDescription>
</Alert>
```

```tsx
<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon"><FolderIcon /></EmptyMedia>
    <EmptyTitle>No projects yet</EmptyTitle>
    <EmptyDescription>Get started by creating a new project.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent><Button>Create Project</Button></EmptyContent>
</Empty>
```

```tsx
import { toast } from "sonner"

toast.success("Changes saved.")
toast.error("Something went wrong.")
```

```tsx
<Card>
  <CardHeader>
    <CardTitle>Team Members</CardTitle>
    <CardDescription>Manage your team.</CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
  <CardFooter><Button>Invite</Button></CardFooter>
</Card>
```

```tsx
<Button disabled>
  <Spinner data-icon="inline-start" />
  Saving...
</Button>
```

```tsx
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
  </TabsList>
  <TabsContent value="account">...</TabsContent>
</Tabs>
```

```tsx
<Avatar>
  <AvatarImage src="/avatar.png" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```
