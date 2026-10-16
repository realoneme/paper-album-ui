# Alert

An inline message inside the page in one of the four semantic tones: `info`, `success`, `warning`, `destructive`. Title + one or two sentences, an icon first.

- Classes: `pa-alert` + `.info|.success|.warning|.destructive`, `pa-alert-title`, `pa-alert-desc`. Plain `pa-alert` is a neutral sunken note.
- Sits on paper like a toast: `card` ground, `shadow-raised-1`, the tone only in a 32px icon disc (`pa-alert-icon`); warning and destructive hang a small bookmark ribbon from the top-right edge. Title in `card-foreground`, description in `muted-foreground`.
- Use `role="status"` for info and success, `role="alert"` for warning and destructive.
