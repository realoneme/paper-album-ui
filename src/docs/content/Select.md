# Select

A custom listbox for short option lists with groups; the trigger is a paper key, the list a top sheet.

- React: `Select` (`value`/`defaultValue`, `onValueChange`), `SelectTrigger` + `SelectValue placeholder`, `SelectContent` (popper under the trigger), `SelectGroup`, `SelectLabel`, `SelectItem value disabled`, `SelectSeparator` from `@/components/ui/select`, built on Radix Select (typeahead, arrow keys, Escape). The chosen option shows a check, not just a tint.
- An open Radix Select is modal (scroll lock, outside clicks blocked), so never render it open by default in a page.
- Label the trigger with `<label htmlFor>` or `aria-label`.
- Highlight: Radix's `[data-highlighted]` follows the pointer and the arrow keys; the keyboard ring shows on `:focus-visible`. `:hover` never paints an option, and the chosen option keeps its check and a hairline frame, not the highlight tint.
- Motion: the sheet slides down from the trigger (`--radix-select-content-transform-origin`, `--dur-base`, `--ease-paper`) and slides back up on close; up when it opens above. Reduced motion: fade only.

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
