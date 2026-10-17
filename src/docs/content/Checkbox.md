# Checkbox

A small sunken square that fills with deep wood when checked; supports `mixed`.

- React: `<Checkbox checked onCheckedChange disabled>` (Radix Checkbox). `checked` is `true`, `false` or `'indeterminate'` (rendered as `aria-checked="mixed"` with a dash). Children are the visible label inside the same button.
- Motion: the indicator stays mounted (`forceMount`) and carries `data-state`, so the fill transitions, the tick draws in with a stroke dash and undraws on uncheck, and the indeterminate dash does the same. Each change after mount gives the box a small spring "pop" (`--dur-base`). With `prefers-reduced-motion` the state changes instantly.

```tsx
<Checkbox checked={giftWrap} onCheckedChange={(v) => setGiftWrap(v === true)}>Gift wrap</Checkbox>
```
