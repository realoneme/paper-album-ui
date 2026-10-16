# Hover Card

A preview that appears while hovering a link (a person, an album). Never put the only copy of information here.

- React: `HoverCard` (`openDelay`, `closeDelay`), `HoverCardTrigger` (a link), `HoverCardContent` (`container`, `align`, `side`) from `@/components/ui/hover-card`, built on Radix Hover Card; opens on hover and keyboard focus. Usual content: an avatar and two lines of text.

```tsx
<HoverCard>
  <HoverCardTrigger href="/team/mira">@mira.k</HoverCardTrigger>
  <HoverCardContent>
    <span className="pa-avatar lg photo" aria-hidden="true" />
    <div><b>Mira K.</b><p className="pa-caption">Second shooter · film and natural light.</p></div>
  </HoverCardContent>
</HoverCard>
```
