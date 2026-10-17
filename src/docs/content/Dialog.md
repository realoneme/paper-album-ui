# Dialog

A modal top sheet over a dimmed page, for focused edits.

- Consumer provides: title, optional description, body, footer actions (secondary then default), a close button.
- React: `Dialog` (`open`/`defaultOpen`, `onOpenChange`, `modal`), `DialogTrigger`, `DialogContent` (`container`, `showCloseButton`, `closeLabel`), `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose` from `@/components/ui/dialog`, built on Radix Dialog for focus trap, Escape and scroll lock. A `DialogTitle` is required; wrap it in `VisuallyHidden` if it must not show.
- Without `container` the backdrop and sheet are fixed to the viewport; pass a positioned element to keep them inside it.

```tsx
<Dialog>
  <DialogTrigger asChild><Button variant="secondary">Edit album</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit album</DialogTitle>
      <DialogDescription>Changes show on the cover pocket right away.</DialogDescription>
    </DialogHeader>
    <Field>…</Field>
    <DialogFooter>
      <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
      <Button>Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Motion

- Opening grows the sheet out of its trigger and into its place while the backdrop fades in; closing shrinks it back into the trigger. `DialogContent` does this itself (FLIP): it reads the trigger's and its own rect, writes `--from-x`, `--from-y`, `--from-sx`, `--from-sy` and `--from-radius` on the content and sets `data-from="trigger"`; the `pa-grow` keyframes run from that transform to rest (`--dur-slow`, `--ease-paper`) and back on `data-state="closed"` (`--dur-base`, `--ease-in-paper`). Radix waits for the exit keyframe before unmounting.
- Works portaled into a `container` or fixed to the viewport. With no trigger (controlled `open` only) it scales and fades from the centre instead.
- The title and body fade in just after the box has grown. Reduced motion: a fade only.
- `useGrowFromTrigger(ref)` is exported for custom modal content that wants the same motion (add the `pa-grow` class).

```tsx
const [open, setOpen] = React.useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  {/* Grows out of this button and shrinks back into it. */}
  <DialogTrigger asChild><Button variant="secondary">Edit album</Button></DialogTrigger>
  <DialogContent container={stage /* optional positioned element */}>
    <DialogHeader><DialogTitle>Edit album</DialogTitle></DialogHeader>
    …
  </DialogContent>
</Dialog>
```
