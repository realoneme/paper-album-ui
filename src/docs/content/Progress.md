# Progress

A filling groove for known progress (uploads, exports). Deep wood while running, wood when done.

- React: `<Progress value max aria-label|aria-labelledby done>` from `@/components/ui/progress`, built on Radix Progress (`role="progressbar"`, `aria-valuenow`); it switches to the done look at `value >= max`. Omit `value` for indeterminate. Show the percentage in text too.

```tsx
<span id="f1">IMG_2034.jpg</span> <b>64%</b>
<Progress aria-labelledby="f1" value={64} />
```
