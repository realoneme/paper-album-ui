# Textarea

A multi-line groove; same fill and shadow as Input, 96px minimum height.

- React: `<Textarea>` (native textarea props, forwards its ref). Resizes vertically only. Inside a `Field` it picks up id, description and invalid state.
- `autoResize?: boolean` (default `false`): the height follows the content, growing and shrinking. Uses CSS `field-sizing: content` where supported and otherwise measures `scrollHeight` on input and on `value` changes (controlled and uncontrolled). The manual resize handle is hidden.
- `minRows?: number` / `maxRows?: number` (with `autoResize`): clamp the height in rows (line height + padding). Without `minRows` the 96px minimum applies; past `maxRows` the textarea scrolls, below it overflow stays hidden.
- The forwarded ref still points at the `<textarea>` (it is merged with the internal one).

```tsx
<Field>
  <FieldLabel>Message</FieldLabel>
  <Textarea rows={3} placeholder="[Tell us about your session]" />
</Field>

<Field>
  <FieldLabel>Caption</FieldLabel>
  <Textarea autoResize minRows={2} maxRows={6} value={caption} onChange={(e) => setCaption(e.target.value)} />
  <FieldDescription>Grows as you type, up to six lines, then scrolls.</FieldDescription>
</Field>
```
