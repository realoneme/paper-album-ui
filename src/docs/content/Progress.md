# Progress

A filling groove for progress (uploads, exports). The fill glides to each new value (600ms, `--ease-paper`) and a soft band of light sweeps across the filled part while it runs; at 100% the sweep stops and the fill settles into the success tone.

- React: `<Progress value max aria-label|aria-labelledby done>` from `@/components/ui/progress`, built on Radix Progress (`role="progressbar"`, `aria-valuenow`, `aria-valuemax`). It switches to the done look at `value >= max` (or force it with `done`). Show the percentage in text too.
- Indeterminate: leave `value` out or pass `null` when you cannot measure (preparing an export). A glowing segment travels back and forth and `aria-valuenow` is omitted, so assistive tech announces it as busy, not as 0%.
- Reduced motion: no sweep, no travelling segment (it rests in the middle), and the width changes instantly.

```tsx
<span id="f1">IMG_2034.jpg</span> <b>64%</b>
<Progress aria-labelledby="f1" value={64} />
<Progress aria-label="Album export" value={null} />
```
