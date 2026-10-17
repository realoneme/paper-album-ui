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

## Timing and motion

- Hover opens a panel immediately: `NavigationMenu` defaults to `delayDuration={0}` and `skipDelayDuration={0}`. A click that lands within a second of the hover keeps the panel open instead of toggling it shut.
- Panels fade in with a 4px drop in 140ms and fade out in 80ms. Reduced motion: a fade only.

```tsx
{/* Restore a hover delay if a page needs one. */}
<NavigationMenu aria-label="Site" delayDuration={150}>
  <NavigationMenuList>…</NavigationMenuList>
</NavigationMenu>
```
