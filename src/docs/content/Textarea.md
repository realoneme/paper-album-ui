# Textarea

A multi-line groove; same fill and shadow as Input, 96px minimum height.

- React: `<Textarea>` (native textarea props, forwards its ref). Resizes vertically only. Inside a `Field` it picks up id, description and invalid state.

```tsx
<Field>
  <FieldLabel>Message</FieldLabel>
  <Textarea rows={3} placeholder="[Tell us about your session]" />
</Field>
```
