# Radio Group

Mutually exclusive options as paper slips; the chosen slip is raised.

- Consumer provides: options with a title and a one-line meta.
- React: `<RadioGroup value onValueChange aria-label>` (Radix RadioGroup) with `<RadioGroupItem value disabled?>` children holding the title and meta. Arrow keys move and select.
- Motion: the dot (`.pa-radio-fill`, a mounted Radix Indicator with `data-state`) springs in when selected (`--ease-spring`, `--dur-base`) and tucks away when deselected (`--ease-in-paper`, `--dur-fast`); the slip's fill and shadow transition too. With `prefers-reduced-motion` the change is instant.

```tsx
<RadioGroup aria-label="Print size" value={size} onValueChange={setSize}>
  <RadioGroupItem value="a4">
    <span><b>A4</b><br /><span className="pa-caption">21 × 29.7 cm · from $60</span></span>
  </RadioGroupItem>
</RadioGroup>
```
