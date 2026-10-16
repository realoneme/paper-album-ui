# Table

A plain table for reading: uppercase header, row rules, numbers right-aligned in tabular figures.

- React: `Table` (wrapped in a horizontal scroller), `TableHeader`, `TableBody`, `TableFooter`, `TableRow` (`aria-selected` shades it), `TableHead` (`scope="col"`, `numeric`), `TableCell` (`numeric` right-aligns tabular figures), `TableCaption` for the footnote.

```tsx
<Table>
  <TableCaption>All prints are archival cotton rag, signed.</TableCaption>
  <TableHeader>
    <TableRow><TableHead>Size</TableHead><TableHead numeric>Price</TableHead></TableRow>
  </TableHeader>
  <TableBody>
    <TableRow><TableCell>A4</TableCell><TableCell numeric>$60</TableCell></TableRow>
  </TableBody>
</Table>
```
