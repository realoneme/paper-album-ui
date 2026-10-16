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
