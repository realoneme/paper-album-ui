# Context Menu

The same menu on right-click or long-press, for actions on one item.

- React: `ContextMenu`, `ContextMenuTrigger` (the area), `ContextMenuContent` (`container`), and the same item parts as Dropdown Menu (`ContextMenuItem`, `ContextMenuCheckboxItem`, `ContextMenuRadioItem`, `ContextMenuLabel`, `ContextMenuSeparator`, `ContextMenuSub…`, `ContextMenuShortcut`) from `@/components/ui/context-menu`, built on Radix Context Menu.
- Every action must also be reachable without right-click.
- Spacing: items, separators and `ContextMenuGroup`s are direct children of the `.pa-menu` sheet, so its 2px gap keeps a highlighted item off its neighbours. Do not wrap items in extra elements.
- Highlight: one source of truth, Radix's `[data-highlighted]`, which follows the pointer item by item and the arrow keys. `:hover` never paints a menu item and no item is pinned, so they cannot disagree; each item's hit area bridges the 2px gap so the highlight never drops out between items.
- Motion: the sheet slides down from its trigger (6px travel, a slight fold and a clip, `--dur-base` with `--ease-paper`, origin from Radix's `--radix-*-content-transform-origin`) and slides back up on close (`data-state="closed"`; Radix keeps it mounted until the animation ends). It slides up instead when it opens above (`data-side="top"`), sideways for submenus. Reduced motion: fade only.
- `ContextMenuSub` opens on hover without delay, like Dropdown Menu.

```tsx
<ContextMenu>
  <ContextMenuTrigger className="pa-context-area">…photo…</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Set as cover</ContextMenuItem>
    <ContextMenuItem>Copy link</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem variant="destructive">Remove</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```
