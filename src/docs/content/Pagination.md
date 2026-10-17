# Pagination

Page links where the current page rises as a deep-wood tile.

- React: `Pagination` (`nav aria-label="Pagination"`), `PaginationContent`, `PaginationItem`, `PaginationLink` (`isActive` → `aria-current="page"`, `disabled`, `asChild`), `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis`, `PaginationSummary` (`page`, `total`) from `@/components/ui/pagination`. Tiles are 44px touch targets.
- Compact layout: when the pagination is narrower than 480px (its own width, so it also applies in narrow columns), the numbered links give way to `PaginationSummary` ("2 / 12", read as "Page 2 of 12") and Previous / Next shrink to their arrows. Without a summary the current page tile stays between the arrows.

```tsx
<Pagination>
  <PaginationContent>
    <PaginationItem><PaginationPrevious href="?page=1" /></PaginationItem>
    <PaginationItem><PaginationLink href="?page=2" isActive>2</PaginationLink></PaginationItem>
    <PaginationItem><PaginationEllipsis /></PaginationItem>
    <PaginationItem><PaginationNext href="?page=3" /></PaginationItem>
  </PaginationContent>
</Pagination>
```
