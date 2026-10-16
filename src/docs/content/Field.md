# Field

A label, a control, and a description or error, stacked with `space-2`.

- Consumer provides: label text, the control, optional description, optional error message.
- React: `<Field invalid? controlId?>` with `FieldLabel`, a control (`Input`, `Textarea`, `InputGroupInput`, or any control using `useFieldControl`), `FieldDescription` and `FieldError`. The control gets the field's `id`, `aria-describedby` (description and error) and `aria-invalid` (red groove) automatically; `FieldError` renders nothing when empty and marks the control invalid while shown.
- Do: write errors as instructions ("Enter a complete email address.").

```tsx
<Field>
  <FieldLabel>Email</FieldLabel>
  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
  <FieldDescription>We send the gallery link here.</FieldDescription>
  <FieldError>{error}</FieldError>
</Field>
```
