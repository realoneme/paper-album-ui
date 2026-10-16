# Sheet

A panel that slides from an edge, showing three page edges on its leading side.

- Props: `side` (right by default; left, top, bottom), title, content, close.
- React: `Sheet`, `SheetTrigger`, `SheetContent` (`side`, `container`, `showCloseButton`), `SheetHeader`, `SheetTitle`, `SheetDescription`, `SheetFooter`, `SheetClose` from `@/components/ui/sheet`, built on Radix Dialog (focus trap, Escape). `sheetVariants` exposes the side classes.

```tsx
<Sheet>
  <SheetTrigger asChild><Button variant="secondary">Photo details</Button></SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Photo details</SheetTitle>
      <SheetDescription>Frame 12 of Winter in Hokkaido.</SheetDescription>
    </SheetHeader>
    …
    <SheetFooter><Button>Order a print</Button></SheetFooter>
  </SheetContent>
</Sheet>
```
