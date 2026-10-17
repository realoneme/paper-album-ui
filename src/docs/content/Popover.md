# Popover

A small top sheet opened by a click, with a pointer to its trigger.

- Consumer provides: trigger, short content (one task).
- React: `Popover`, `PopoverTrigger`, `PopoverContent` (`container`, `align` start by default, `side`, `sideOffset`), `PopoverAnchor`, `PopoverClose` from `@/components/ui/popover`, built on Radix Popover. The pointer follows the side and alignment. Name the content with `aria-label` or a heading.

```tsx
<Popover>
  <PopoverTrigger asChild><Button variant="secondary">Share album</Button></PopoverTrigger>
  <PopoverContent aria-label="Share album">
    <b>Private link</b>
    <p className="pa-caption">Anyone with the link can view.</p>
  </PopoverContent>
</Popover>
```

## Motion

- Opens with a scale from 0.96, a fade and a 6px slide away from the trigger side (`--dur-base`, `--ease-paper`), growing from Radix's `--radix-popover-content-transform-origin`; closes the reverse way in `--dur-fast`. Reduced motion: a fade only.

```tsx
<Popover>
  <PopoverTrigger asChild><Button variant="secondary">Sort</Button></PopoverTrigger>
  {/* Slides 6px up out of the trigger. */}
  <PopoverContent side="top" aria-label="Sort photos">…</PopoverContent>
</Popover>
```
