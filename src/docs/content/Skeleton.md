# Skeleton

Shimmering paper placeholders while content loads; match the real layout's shapes.

- React: `<Skeleton style={{ width, height }} />` from `@/components/ui/skeleton` (a decorative `div`, `aria-hidden`). Wrap the group in a container with `role="status"` and an `aria-label`.

```tsx
<div role="status" aria-label="Loading album">
  <Skeleton style={{ width: 96, height: 110 }} />
  <Skeleton style={{ height: 18, width: '80%' }} />
</div>
```
