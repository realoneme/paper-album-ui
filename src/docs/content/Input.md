# Input

A single-line text groove pressed into the paper.

- Props: native input attributes. Height 44px, `input` fill, `shadow-sunken`. Disabled uses `opacity-disabled`.
- React: `<Input>` (forwards its ref to the `<input>`; `type` defaults to `text`). Inside a `Field` it picks up id, description and invalid state.
- Don't: add a border; the groove is the affordance.

```tsx
<Input aria-label="Name" placeholder="[Name]" value={name} onChange={(e) => setName(e.target.value)} />
```
