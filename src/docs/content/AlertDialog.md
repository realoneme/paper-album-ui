# Alert Dialog

A confirmation that interrupts: what will happen, what stays safe, and two clear choices.

- Consumer provides: title as a question, a consequence sentence, a safe action and a destructive action labelled with the verb.
- React: `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent` (`container`), `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogCancel` (secondary, focused on open), `AlertDialogAction` (`variant`, `size` as Button) from `@/components/ui/alert-dialog`, built on Radix Alert Dialog (`role="alertdialog"`, always modal, outside clicks ignored).

```tsx
<AlertDialog>
  <AlertDialogTrigger asChild><Button variant="destructive">Delete album</Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete this album?</AlertDialogTitle>
      <AlertDialogDescription>Its 24 photos leave your site. Originals stay in your library.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Keep album</AlertDialogCancel>
      <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Motion

- Same as Dialog: the alert grows out of the button that triggered it (FLIP custom properties `--from-x`, `--from-y`, `--from-sx`, `--from-sy`, `--from-radius` on the content, `data-from="trigger"`), the backdrop fades in, and on close (`data-state="closed"`) it shrinks back into the trigger before unmounting. Without a trigger it scales and fades from the centre. Reduced motion: a fade only.

```tsx
<AlertDialog>
  {/* The alert grows out of this button. */}
  <AlertDialogTrigger asChild><Button variant="destructive">Delete album</Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete this album?</AlertDialogTitle>
      <AlertDialogDescription>Originals stay in your library.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Keep album</AlertDialogCancel>
      <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```
