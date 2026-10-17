# Toggle Group

A segmented strip of toggles; the chosen segment rises out of the groove.

- React: `<ToggleGroup type="single | multiple" value onValueChange aria-label>` (Radix ToggleGroup) with `<ToggleGroupItem value>` children (icon + label). `single` renders a radiogroup with `aria-checked`; `multiple` a toolbar with `aria-pressed`. Arrow keys move between items.
- Motion (`single`): one paper thumb (`.pa-tgroup-thumb`, `aria-hidden`) sits behind the items and slides to the chosen one (`transform` + `width`, `--dur-base`). It is measured from the item rects, follows click, keyboard and controlled values, re-measures on resize, appears without animation on first render and is removed when nothing is selected.
- Motion (`multiple`): each pressed item animates its own fill and shadow; there is no shared thumb.
- With `prefers-reduced-motion` the thumb jumps instead of sliding.
- Do: 2–5 short options. Don't: use for more than five; use Select instead.

```tsx
<ToggleGroup type="single" aria-label="Gallery layout" value={layout} onValueChange={(v) => v && setLayout(v)}>
  <ToggleGroupItem value="grid"><LayoutGrid className="pa-i sm" aria-hidden />Grid</ToggleGroupItem>
  <ToggleGroupItem value="list"><List className="pa-i sm" aria-hidden />List</ToggleGroupItem>
</ToggleGroup>

<ToggleGroup type="multiple" aria-label="Photo overlays" defaultValue={['captions']}>
  <ToggleGroupItem value="captions">Captions</ToggleGroupItem>
  <ToggleGroupItem value="exif">EXIF</ToggleGroupItem>
</ToggleGroup>
```
