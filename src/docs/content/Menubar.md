# Menubar

A desktop-style menu bar for editor screens, with submenus.

- React: `Menubar` (`aria-label`, `value`/`defaultValue`), `MenubarMenu`, `MenubarTrigger`, `MenubarContent` (`container`), and the same item parts as Dropdown Menu (`MenubarItem`, `MenubarCheckboxItem`, `MenubarRadioItem`, `MenubarLabel`, `MenubarSeparator`, `MenubarSub` + `MenubarSubTrigger` + `MenubarSubContent`, `MenubarShortcut`) from `@/components/ui/menubar`, built on Radix Menubar (left/right arrows move between menus).
- A paper slip (`.pa-menubar-slip`, aria-hidden) slides under the open menu's trigger (`transform` and size, `--dur-base`, `--ease-paper`) and follows when the reader moves between menus by hover or the arrow keys. It is hidden while no menu is open and appears in place, without travelling; with reduced motion it jumps. `Menubar` works controlled (`value` + `onValueChange`, `''` for none) or uncontrolled.
- Once a menu is open, hovering another trigger switches at once (the old sheet goes without its exit motion); closing the bar slides the sheet up. `MenubarSub` opens on hover without delay.
- Highlight: one source of truth, Radix's `[data-highlighted]`, which follows the pointer item by item and the arrow keys. `:hover` never paints a menu item and no item is pinned, so they cannot disagree; each item's hit area bridges the 2px gap so the highlight never drops out between items.
- Motion: the sheet slides down from its trigger (6px travel, a slight fold and a clip, `--dur-base` with `--ease-paper`, origin from Radix's `--radix-*-content-transform-origin`) and slides back up on close (`data-state="closed"`; Radix keeps it mounted until the animation ends). It slides up instead when it opens above (`data-side="top"`), sideways for submenus. Reduced motion: fade only.

```tsx
<Menubar aria-label="Editor">
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New album</MenubarItem>
      <MenubarSub>
        <MenubarSubTrigger>Export as</MenubarSubTrigger>
        <MenubarSubContent><MenubarItem>JPEG · web</MenubarItem></MenubarSubContent>
      </MenubarSub>
      <MenubarSeparator />
      <MenubarItem disabled>Publish changes</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

```tsx
const [menu, setMenu] = React.useState('');

<Menubar aria-label="Editor" value={menu} onValueChange={setMenu}>
  <MenubarMenu value="file">
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent><MenubarItem>New album</MenubarItem></MenubarContent>
  </MenubarMenu>
  <MenubarMenu value="edit">
    <MenubarTrigger>Edit</MenubarTrigger>
    <MenubarContent><MenubarItem>Undo</MenubarItem></MenubarContent>
  </MenubarMenu>
</Menubar>
```
