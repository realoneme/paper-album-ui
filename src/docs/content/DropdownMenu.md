# Dropdown Menu

A menu of actions from a button: groups, checkable items, a destructive item last.

- React: `DropdownMenu` (`modal`), `DropdownMenuTrigger`, `DropdownMenuContent` (`container`, `align`, `sideOffset`), `DropdownMenuGroup`, `DropdownMenuLabel`, `DropdownMenuItem` (`variant="destructive"`, `inset`), `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup` + `DropdownMenuRadioItem`, `DropdownMenuSeparator`, `DropdownMenuSub` + `DropdownMenuSubTrigger` + `DropdownMenuSubContent`, `DropdownMenuShortcut` from `@/components/ui/dropdown-menu`, built on Radix Dropdown Menu (arrow keys, typeahead, Escape).
- Keep menus free of shortcut glyphs; spell keys out in words if a hint is needed.
- Highlight: one source of truth, Radix's `[data-highlighted]`, which follows the pointer item by item and the arrow keys. `:hover` never paints a menu item and no item is pinned, so they cannot disagree; each item's hit area bridges the 2px gap so the highlight never drops out between items.
- Motion: the sheet slides down from its trigger (6px travel, a slight fold and a clip, `--dur-base` with `--ease-paper`, origin from Radix's `--radix-*-content-transform-origin`) and slides back up on close (`data-state="closed"`; Radix keeps it mounted until the animation ends). It slides up instead when it opens above (`data-side="top"`), sideways for submenus. Reduced motion: fade only.
- `DropdownMenuSub` (`open`/`defaultOpen`/`onOpenChange`) opens its submenu the moment the pointer rests on `DropdownMenuSubTrigger` (Radix alone waits 100ms); Radix's pointer-grace triangle still keeps it open while the pointer heads for it.

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild><Button variant="secondary">[Studio Name]</Button></DropdownMenuTrigger>
  <DropdownMenuContent align="start">
    <DropdownMenuLabel>My studio</DropdownMenuLabel>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuCheckboxItem checked={watermark} onCheckedChange={setWatermark}>Show watermark</DropdownMenuCheckboxItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

```tsx
<DropdownMenuSub onOpenChange={setExportOpen}>
  <DropdownMenuSubTrigger>Export as</DropdownMenuSubTrigger>
  <DropdownMenuSubContent>
    <DropdownMenuItem>JPEG · web</DropdownMenuItem>
    <DropdownMenuItem>TIFF · print</DropdownMenuItem>
  </DropdownMenuSubContent>
</DropdownMenuSub>
```
