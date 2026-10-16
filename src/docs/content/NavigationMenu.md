# Navigation Menu

The site's main navigation; an item can open a wide panel of album covers and links.

- Consumer provides: top-level links, optional panel content (up to three covers + a link column).
- React: `NavigationMenu` (`aria-label`, `value`/`defaultValue`), `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent` (the panel, in `pa-pop`, under the strip), `NavigationMenuLink` (`topLevel` for strip links, `active` for the current page) from `@/components/ui/navigation-menu`, built on Radix Navigation Menu (hover, click, Enter, Escape).

```tsx
<NavigationMenu aria-label="Site">
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Albums</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="/albums">All albums</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink topLevel href="/journal">Journal</NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```
