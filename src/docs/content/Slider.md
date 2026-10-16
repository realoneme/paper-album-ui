# Slider

Pick a value or range along a sunken track; the filled part is wood.

- React: `<Slider value|defaultValue={[n]} onValueChange min max step>` from `@/components/ui/slider`, built on Radix Slider (keyboard: arrows, Page Up/Down, Home, End). Pass two values for a range (`minStepsBetweenThumbs`). Name it with `aria-label` (range thumbs become "…, minimum/maximum") or `thumbLabels`; `formatValueText` sets `aria-valuetext` (e.g. "$80").
- Show the current value next to the label so it is readable without dragging.

```tsx
<Slider aria-label="Price" value={range} onValueChange={setRange} min={0} max={400} step={10} formatValueText={(v) => `$${v}`} />
```
