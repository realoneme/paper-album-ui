# Photo Holder

Intentional addition: the four ways a print is held on a page — corners, corner slits, a pocket, tape.

- Consumer provides: the photograph and the holder style; captions in `note-sm` on the print border.
- React: `PhotoHolder` from `@/components/ui/photo-holder` — `variant` (`corners` default, `slits`, `pocket`, `tape`), children = the photo (`<img>` or `PhotoPlaceholder tone={1…5}`), `caption` (figcaption below), `note` (handwritten, on the print border of `pocket`/`tape`), `rotate` (degrees, clamped to −8…8). Renders a `figure`; holder parts are `aria-hidden`.

```tsx
<PhotoHolder variant="tape" rotate={2.5} note="Lisbon, May" caption="Tape">
  <img src="/photos/lisbon.jpg" alt="Tram on Rua da Bica at dawn" />
</PhotoHolder>
```
- Do: rotate loose prints −8° to +8°. Don't: combine two holders on one photo.
