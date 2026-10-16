# Input Group

An input with an icon, an addon or a button inside the same groove.

- Consumer provides: the input plus leading icon/addon and/or trailing button or `Kbd`.
- React: `<InputGroup>` containing `InputGroupInput` (native input props), and optionally a leading icon, `InputGroupAddon` (fixed prefix on a darker strip), `InputGroupText` (inline text such as a currency) or a trailing `Button size="sm"`.
- Do: label the input with `aria-label` when the group has no visible label.

```tsx
<InputGroup>
  <InputGroupAddon>studio.com/</InputGroupAddon>
  <InputGroupInput aria-label="Album URL" value={slug} onChange={(e) => setSlug(e.target.value)} />
</InputGroup>
```
