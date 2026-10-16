# Item

A list row: media, title, description and one trailing action or badge. The dashed variant invites adding a new item.

- React: `Item` (`variant="default" | "dashed"`, `asChild` for a link row), `ItemMedia` (`variant="image" | "icon"`), `ItemContent`, `ItemTitle`, `ItemDescription`, `ItemActions`.

```tsx
<Item>
  <ItemMedia className="ph-2" aria-hidden />
  <ItemContent>
    <ItemTitle>Lisbon Mornings</ItemTitle>
    <ItemDescription>18 photos · updated 2 days ago</ItemDescription>
  </ItemContent>
  <ItemActions>
    <Button variant="secondary" size="sm">Open</Button>
  </ItemActions>
</Item>
```
