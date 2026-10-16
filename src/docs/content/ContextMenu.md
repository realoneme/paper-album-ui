# Context Menu

The same menu on right-click or long-press, for actions on one item.

- React: `ContextMenu`, `ContextMenuTrigger` (the area), `ContextMenuContent` (`container`), and the same item parts as Dropdown Menu (`ContextMenuItem`, `ContextMenuCheckboxItem`, `ContextMenuRadioItem`, `ContextMenuLabel`, `ContextMenuSeparator`, `ContextMenuSub…`, `ContextMenuShortcut`) from `@/components/ui/context-menu`, built on Radix Context Menu.
- Every action must also be reachable without right-click.

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
