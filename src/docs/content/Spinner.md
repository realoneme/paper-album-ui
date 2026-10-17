# Spinner

A gooey comet for unknown waits: a lead ball circles and a tail of shrinking balls follows; an SVG goo filter (a blur, then an alpha threshold) melts them into one liquid drop that stretches as it speeds up and gathers as it slows. Inside a button it replaces the icon and the label says what is happening.

- React: `<Spinner label tone size>` from `@/components/ui/spinner`, an SVG with `role="status"` named by `aria-label` ("Loading" by default). `tone`: `wood` (default), `primary`, `current` (follows text colour, for buttons); the balls fill with `currentColor`. `size`: `sm` 18px, default 32px, `lg` 48px. Each instance gets its own filter id (`React.useId`), so many spinners can share a page. Pass `aria-hidden` when a nearby label already says what is happening.
- Reduced motion: the comet holds still.

```tsx
<Spinner label="Loading album" />
<Button disabled aria-busy><Spinner tone="current" size="sm" aria-hidden />Uploading 12 photos</Button>
```
