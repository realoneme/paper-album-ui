# Card

A raised sheet with header, content and footer; use `stack` for album cards that show page thickness.

- Consumer provides: optional media, title, description, actions.
- React: `Card` (`variant="default" | "stack"`, `asChild` to render an `<article>`), `CardHeader`, `CardTitle` (h3), `CardDescription`, `CardContent`, `CardFooter`.
- Footer actions use `size="sm"` buttons, so a card's actions stay lighter than the page's own.

```tsx
<Card variant="stack" asChild>
  <article>
    <CardHeader>
      <CardTitle>Winter in Hokkaido</CardTitle>
      <CardDescription>Snow light, harbour mornings and a very cold ferry.</CardDescription>
    </CardHeader>
    <CardFooter>
      <Button size="sm">Open album</Button>
    </CardFooter>
  </article>
</Card>
```
