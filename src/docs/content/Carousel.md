# Carousel

A strip of prints that pages left and right; neighbours peek at reduced opacity.

- Consumer provides: slides (photo + handwritten caption), prev/next buttons, a position indicator.
- React (Embla): `Carousel` (region, `aria-roledescription="carousel"`, needs `aria-label`; `opts`, `plugins`, `setApi`; arrow keys page), `CarouselContent`, `CarouselItem` (slide group; current slide gets `aria-current`), `CarouselPrevious` / `CarouselNext` (labelled icon keys, disabled at the ends), `CarouselDots`, `CarouselCounter`, `CarouselIndicator`, `CarouselControls` to lay them out.

## How do I show the total?

- `CarouselCounter` shows "3 / 12" (current / total) in tabular numbers and announces "Slide 3 of 12" through `aria-live="polite"`. Pass `count` so it shows the total before Embla has measured.
- `CarouselIndicator variant="auto"` (default) shows dots for up to 7 pages and the counter beyond that; `maxDots` changes the cut-off, and `variant="dots"` or `"counter"` forces one. Dots stop being readable past about seven, so long strips should count.
- The total counts scroll pages (the same as the dots). With the default 70% slides each slide is a page; if several slides fit in view, the last ones share a page.
- Also label each slide (`aria-label="3 of 12"`) so screen readers hear the position on the slide itself.
- Controls: prev, dots, next and the counter share a row; the dots never wrap, and when the row is too narrow the counter drops to its own line. For long sets use the counter instead of dots.

```tsx
<Carousel aria-label="Featured prints">
  <CarouselContent>
    <CarouselItem aria-label="1 of 12">
      <figure className="pa-print"><span className="pa-photo ph-1" /><figcaption className="cap">Otaru, dawn</figcaption></figure>
    </CarouselItem>
  </CarouselContent>
  <CarouselControls>
    <CarouselPrevious /><CarouselIndicator count={12} /><CarouselNext />
  </CarouselControls>
</Carousel>
```
