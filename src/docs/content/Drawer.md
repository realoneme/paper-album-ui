# Drawer

A bottom sheet with a grab handle, for phones and quick choices.

- Consumer provides: title, short description, options, a primary action that states the price or result.
- React: `Drawer` (vaul root: `open`, `onOpenChange`, `modal`, `snapPoints`…), `DrawerTrigger`, `DrawerContent` (`container`; renders the handle), `DrawerHeader`, `DrawerTitle`, `DrawerDescription`, `DrawerFooter`, `DrawerClose` from `@/components/ui/drawer`, built on vaul (drag down, Escape).

```tsx
<Drawer>
  <DrawerTrigger asChild><Button>Order a print</Button></DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Order a print</DrawerTitle>
      <DrawerDescription>Archival cotton paper, signed on the back.</DrawerDescription>
    </DrawerHeader>
    <ToggleGroup type="single" aria-label="Size">…</ToggleGroup>
    <DrawerFooter>
      <DrawerClose asChild><Button variant="secondary">Cancel</Button></DrawerClose>
      <Button>Add to cart · $95</Button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```
