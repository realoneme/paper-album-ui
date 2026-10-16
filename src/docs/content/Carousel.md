# Carousel

A strip of prints that pages left and right; neighbours peek at reduced opacity.

- Consumer provides: slides (photo + handwritten caption), prev/next buttons, dots.
- React (Embla): `Carousel` (region, `aria-roledescription="carousel"`, needs `aria-label`; `opts`, `plugins`, `setApi`; arrow keys page), `CarouselContent`, `CarouselItem` (slide group; current slide gets `aria-current`), `CarouselPrevious` / `CarouselNext` (labelled icon keys, disabled at the ends), `CarouselDots`, `CarouselControls` to lay them out.

```tsx
<Carousel aria-label="Featured prints">
  <CarouselContent>
    <CarouselItem aria-label="1 of 2">
      <figure className="pa-print"><span className="pa-photo ph-1" /><figcaption className="cap">Otaru, dawn</figcaption></figure>
    </CarouselItem>
  </CarouselContent>
  <CarouselControls>
    <CarouselPrevious /><CarouselDots /><CarouselNext />
  </CarouselControls>
</Carousel>
```
