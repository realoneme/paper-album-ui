# Checkbox

A small sunken square that fills with deep wood when checked; supports `mixed`.

- React: `<Checkbox checked onCheckedChange disabled>` (Radix Checkbox). `checked` is `true`, `false` or `'indeterminate'` (rendered as `aria-checked="mixed"` with a dash). Children are the visible label inside the same button.

```tsx
<Checkbox checked={giftWrap} onCheckedChange={(v) => setGiftWrap(v === true)}>Gift wrap</Checkbox>
```
