# Spinner

A turning paper band for unknown waits; inside a button it replaces the icon and the label says what is happening.

- React: `<Spinner label tone size>` from `@/components/ui/spinner` — an SVG ring (`role="img"`, named "Loading" by default); `tone`: `wood` (default, on a muted track), `primary`, `current` (follows text colour, for buttons); `size`: `sm` 18px, default 32px, `lg` 48px. Pass `aria-hidden` when a nearby label already says what is happening.

```tsx
<Button disabled aria-busy><Spinner tone="current" size="sm" aria-hidden />Uploading 12 photos</Button>
```
