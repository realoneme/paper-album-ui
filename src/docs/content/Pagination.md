# Pagination

Page links where the current page rises as a deep-wood tile.

- React: `Pagination` (`nav aria-label="Pagination"`), `PaginationContent`, `PaginationItem`, `PaginationLink` (`isActive` → `aria-current="page"`, `disabled`, `asChild`), `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis` from `@/components/ui/pagination`. Tiles are 44px touch targets.

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
