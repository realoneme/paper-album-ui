# Menubar

A desktop-style menu bar for editor screens, with submenus.

- React: `Menubar` (`aria-label`, `value`/`defaultValue`), `MenubarMenu`, `MenubarTrigger`, `MenubarContent` (`container`), and the same item parts as Dropdown Menu (`MenubarItem`, `MenubarCheckboxItem`, `MenubarRadioItem`, `MenubarLabel`, `MenubarSeparator`, `MenubarSub` + `MenubarSubTrigger` + `MenubarSubContent`, `MenubarShortcut`) from `@/components/ui/menubar`, built on Radix Menubar (left/right arrows move between menus).

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
