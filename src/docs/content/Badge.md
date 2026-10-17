# Badge

A pill for status or category. Neutral: `default`, `secondary`, `outline`, `seal` (featured), `wood`. Semantic: `success`, `warning`, `info` (soft tint + strong text; warning text uses `--warning-text`) and `destructive` (solid).

- Sizes: `size="default"` 28px (13px text, 16px icons), `sm` 22px (`micro` text: 10px, weight 400; 12px icons, tighter padding) for table rows and cards, `xs` 18px slim pill (`micro` text: 10px, weight 400; 10px icons, ~6px side padding) for counts and dense metadata. Every size keeps the same colour pairs, so contrast does not change.
- React: `<Badge variant size asChild>` from `@/components/ui/badge` (`badgeVariants({ variant, size })` for other elements). Keep to one or two words; give semantic badges a Lucide icon (`pa-i sm`, `aria-hidden`) so status is not colour-only; the badge resizes the icon for `sm` and `xs`.

```tsx
<Badge variant="success"><Check className="pa-i sm" aria-hidden />Paid</Badge>
<Badge size="sm" variant="warning"><Clock className="pa-i sm" aria-hidden />In review</Badge>
<Badge size="xs" variant="outline">Film</Badge>
```
