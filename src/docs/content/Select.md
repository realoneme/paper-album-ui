# Select

A custom listbox for short option lists with groups; the trigger is a paper key, the list a top sheet.

- React: `Select` (`value`/`defaultValue`, `onValueChange`), `SelectTrigger` + `SelectValue placeholder`, `SelectContent` (popper under the trigger), `SelectGroup`, `SelectLabel`, `SelectItem value disabled`, `SelectSeparator` from `@/components/ui/select`, built on Radix Select (typeahead, arrow keys, Escape). The chosen option shows a check, not just a tint.
- An open Radix Select is modal (scroll lock, outside clicks blocked), so never render it open by default in a page.
- Label the trigger with `<label htmlFor>` or `aria-label`.

```tsx
<Select defaultValue="landscape">
  <SelectTrigger id="genre"><SelectValue placeholder="Choose a genre" /></SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Outdoor</SelectLabel>
      <SelectItem value="landscape">Landscape</SelectItem>
      <SelectItem value="street">Street</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```
