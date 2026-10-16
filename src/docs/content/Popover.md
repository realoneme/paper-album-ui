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
