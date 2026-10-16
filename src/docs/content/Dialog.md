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
