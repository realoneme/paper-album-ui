# Toggle Group

A segmented strip of toggles; the chosen segment rises out of the groove.

- React: `<ToggleGroup type="single | multiple" value onValueChange aria-label>` (Radix ToggleGroup) with `<ToggleGroupItem value>` children (icon + label). `single` renders a radiogroup with `aria-checked`; `multiple` a toolbar with `aria-pressed`. Arrow keys move between items.
- Do: 2–5 short options. Don't: use for more than five; use Select instead.

```tsx
<ToggleGroup type="single" aria-label="Gallery layout" value={layout} onValueChange={(v) => v && setLayout(v)}>
  <ToggleGroupItem value="grid"><LayoutGrid className="pa-i sm" aria-hidden />Grid</ToggleGroupItem>
  <ToggleGroupItem value="list"><List className="pa-i sm" aria-hidden />List</ToggleGroupItem>
</ToggleGroup>
```
