# Navigation Menu

The site's main navigation; an item can open a wide panel of album covers and links.

- Consumer provides: top-level links, optional panel content (up to three covers + a link column).
- React: `NavigationMenu` (`aria-label`, `value`/`defaultValue`), `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent` (the panel, in `pa-pop`, under the strip), `NavigationMenuLink` (`topLevel` for strip links, `active` for the current page) from `@/components/ui/navigation-menu`, built on Radix Navigation Menu (hover, click, Enter, Escape).
- Narrow screens: the strip stays on one line and scrolls sideways; the side with more items fades out (an overlay in the strip's colour, so the panel below is never masked).

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
- A first open fades the panel in with a 4px drop in 140ms; closing fades it out in 80ms. Moving from one trigger to another swaps the panels in place (Radix `data-motion`): the old panel goes at once and the new one appears without the drop, so panels of different heights never overlap. Reduced motion: a fade only.

```tsx
{/* Restore a hover delay if a page needs one. */}
<NavigationMenu aria-label="Site" delayDuration={150}>
  <NavigationMenuList>…</NavigationMenuList>
</NavigationMenu>
```
