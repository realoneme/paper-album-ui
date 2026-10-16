# Badge

A pill for status or category. Neutral: `default`, `secondary`, `outline`, `seal` (featured), `wood`. Semantic: `success`, `warning`, `info` (soft tint + strong text) and `destructive` (solid).

- React: `<Badge variant asChild>` from `@/components/ui/badge` (`badgeVariants` for other elements). Keep to one or two words; give semantic badges a Lucide icon (`pa-i sm`, `aria-hidden`) so status is not colour-only.

```tsx
<Badge variant="success"><Check className="pa-i sm" aria-hidden />Paid</Badge>
```
