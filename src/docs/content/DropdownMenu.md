# Dropdown Menu

A menu of actions from a button: groups, checkable items, a destructive item last.

- React: `DropdownMenu` (`modal`), `DropdownMenuTrigger`, `DropdownMenuContent` (`container`, `align`, `sideOffset`), `DropdownMenuGroup`, `DropdownMenuLabel`, `DropdownMenuItem` (`variant="destructive"`, `inset`), `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup` + `DropdownMenuRadioItem`, `DropdownMenuSeparator`, `DropdownMenuSub` + `DropdownMenuSubTrigger` + `DropdownMenuSubContent`, `DropdownMenuShortcut` from `@/components/ui/dropdown-menu`, built on Radix Dropdown Menu (arrow keys, typeahead, Escape).
- Keep menus free of shortcut glyphs; spell keys out in words if a hint is needed.

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
