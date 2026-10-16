# Label

The text that names a control. 14px, weight 600, `card-foreground` on paper.

- React: `<Label htmlFor>` (Radix Label). Always tie it to its control with `htmlFor`/`id` or by wrapping; inside a `Field`, use `FieldLabel`, which wires `htmlFor` for you.
- Don't: use placeholder text instead of a label.

```tsx
<Label htmlFor="album-title">Album title</Label>
<Input id="album-title" defaultValue="Winter in Hokkaido" />
```
