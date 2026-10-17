# Hover Card

A preview that appears while hovering a link (a person, an album). Never put the only copy of information here.

- React: `HoverCard` (`openDelay` 0, `closeDelay` 120 by default), `HoverCardTrigger` (a link), `HoverCardContent` (`container`, `align`, `side`, `sideOffset`, `alignOffset`) from `@/components/ui/hover-card`, built on Radix Hover Card; opens on hover and keyboard focus. Usual content: a portrait photo, a name, one line of bio, two stats and a link.

## Timing and motion

- Opens immediately (`openDelay` 0) and closes after a short grace period (`closeDelay` 120).
- A portrait card (248px wide, at least 360px tall): photo on top, name, one line of bio, two small stats and a link (`pa-hovercard-photo`, `-name`, `-bio`, `-stats`, `-link`).
- It hangs on a thread from the point where the pointer entered the trigger: `HoverCardTrigger` records the pointer x (on pointer enter and move, until the card is open; the centre for keyboard focus) and `HoverCardContent` turns it into `alignOffset` with `side="bottom"` and `align="start"`. Pass `alignOffset` yourself to opt out. The thread is as long as `sideOffset` (18 by default).
- It appears within 150ms (drop and fade), then swings like a pendulum, 14° → −9° → 5° → −3° → 1° → 0 over about 900ms, from the top of the thread. It lifts away and fades on close. Reduced motion: no swing, just a fade.

```tsx
<HoverCard>
  <HoverCardTrigger href="/team/mira">@mira.k</HoverCardTrigger>
  <HoverCardContent>
    <span className="pa-photo ph-3 pa-hovercard-photo" aria-hidden="true" />
    <p className="pa-hovercard-name">Mira K.</p>
    <p className="pa-caption pa-hovercard-bio">Second shooter · film and natural light.</p>
    <dl className="pa-hovercard-stats">
      <div><dt>Albums</dt><dd>12</dd></div>
      <div><dt>Photos</dt><dd>1,480</dd></div>
    </dl>
    <a className="pa-hovercard-link" href="/team/mira">View profile</a>
  </HoverCardContent>
</HoverCard>
```
