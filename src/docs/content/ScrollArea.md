# Scroll Area

A fixed-height region that scrolls; the scrollbar is a sunken groove with a wood thumb.

- React: `ScrollArea` from `@/components/ui/scroll-area` (Radix Scroll Area) — 180px tall by default (override with `className`/`style`); `label` makes the viewport a focusable named region for keyboard scrolling; `horizontal` adds a second bar; `type` (`hover` default, `always`, `scroll`, `auto`). `ScrollBar` is exported for custom compositions.

```tsx
<ScrollArea label="Photo tags" style={{ height: 180 }}>
  {tags.map((t) => <div key={t}>{t}</div>)}
</ScrollArea>
```
