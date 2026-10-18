# Photo Holder

Intentional addition: the five ways a print is held on a page — corners, corner slits, a pocket, tape, an instant print (polaroid).

- Consumer provides: the photograph and the holder style; captions in `note-sm` on the print border.
- React: `PhotoHolder` from `@/components/ui/photo-holder` — `variant` (`corners` default, `slits`, `pocket`, `tape`, `polaroid`), children = the photo (`<img>` or `PhotoPlaceholder tone={1…5}`), `caption` (figcaption below), `note` (handwritten: the photo's name on the sleeve of a `pocket`, on the margin of `tape` and `polaroid` prints), `rotate` (degrees, clamped to −8…8). Renders a `figure`; holder parts are `aria-hidden`.
- Corners and slit flaps are paper triangles with thickness: a sheen, a lighter cut edge and a shadow onto the photo.
- Motion (pointer devices only, off with reduced motion): the pocket's print lifts 30px out of its sleeve; the taped print is lifted a little off the page from its tape (its bottom edge rises, the shadow deepens) and laid back down; the polaroid is nudged askew and springs back when the pointer leaves. A pocket reserves 30px above it for the lift.

```tsx
<PhotoHolder variant="tape" rotate={2.5} note="Lisbon, May" caption="Tape">
  <img src="/photos/lisbon.jpg" alt="Tram on Rua da Bica at dawn" />
</PhotoHolder>
```
- Do: name pocketed photos with `note`; rotate loose prints −8° to +8°. Don't: combine two holders on one photo.
