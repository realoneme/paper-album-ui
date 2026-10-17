# Command

A searchable command palette (⌘K): a search field over grouped results.

- React: `Command` (`label`, `filter`, `shouldFilter`), `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup` (`heading`), `CommandItem` (`onSelect`, `disabled`), `CommandSeparator`, `CommandShortcut` (right-aligned meta, such as a photo count), and `CommandDialog` (palette in a dialog; `open`, `onOpenChange`, `title`, `container`) from `@/components/ui/command`, built on cmdk: the input is a combobox, results are options, arrow keys move and Enter runs.
- Highlight: one source of truth, cmdk's `[data-selected="true"]`, which follows the pointer and the arrow keys; `:hover` never paints an item. Enabled items carry `data-disabled="false"`, so disabled styling keys on `data-disabled="true"` only.

```tsx
<Command label="Command menu">
  <CommandInput placeholder="Type a command or search…" />
  <CommandList>
    <CommandEmpty>No albums or actions match.</CommandEmpty>
    <CommandGroup heading="Albums">
      <CommandItem onSelect={openAlbum}>Winter in Hokkaido<CommandShortcut>24 photos</CommandShortcut></CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Actions">
      <CommandItem onSelect={newAlbum}>New album</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```
