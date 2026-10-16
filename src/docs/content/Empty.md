# Empty

What an empty album, search or list shows: an empty pocket, a title, one line, one action.

- Consumer provides: title ("No photos yet"), one sentence, a primary action.
- React: `Empty`, `EmptyMedia` (the decorative pocket; children replace it), `EmptyTitle as="h2|h3|h4|p"` (default `h3`), `EmptyDescription`, `EmptyContent` (the action) from `@/components/ui/empty`.

```tsx
<Empty>
  <EmptyMedia />
  <EmptyTitle>No photos yet</EmptyTitle>
  <EmptyDescription>Drop images here to fill this album.</EmptyDescription>
  <EmptyContent><Button>Upload photos</Button></EmptyContent>
</Empty>
```
