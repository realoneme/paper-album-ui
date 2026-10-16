# Alert

An inline message inside the page in one of the four semantic tones: `info`, `success`, `warning`, `destructive`. Title + one or two sentences, an icon first.

- React: `<Alert variant icon role>` + `AlertTitle`, `AlertDescription` from `@/components/ui/alert`. `variant` defaults to a neutral sunken note; each tone brings its own icon in the `pa-alert-icon` disc (`icon` overrides, `null` hides). Role defaults to `status` for info and success, `alert` for warning and destructive.
- Sits on paper like a toast: `card` ground, `shadow-raised-1`, the tone only in a 32px icon disc; warning and destructive hang a small bookmark ribbon from the top-right edge. Title in `card-foreground`, description in `muted-foreground`.

```tsx
<Alert variant="warning">
  <AlertTitle>Storage almost full</AlertTitle>
  <AlertDescription>You have used 9.4 of 10 GB. Archive old albums or upgrade your plan.</AlertDescription>
</Alert>
```
