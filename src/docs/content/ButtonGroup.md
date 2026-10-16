# Button Group

Related buttons that share one paper edge: a pager or a split button.

- Consumer provides: 2–4 buttons, optionally a text segment (`ButtonGroupText`).
- React: `<ButtonGroup variant="default | primary" aria-label>` (paper or deep wood; renders `role="group"`) with `Button` children and `ButtonGroupText` for a non-interactive segment.
- Do: keep each segment at least 44px tall. Don't: mix variants inside one group.

```tsx
<ButtonGroup aria-label="Photo pager">
  <Button aria-label="Previous photo"><ChevronLeft className="pa-i" aria-hidden /></Button>
  <ButtonGroupText>3 / 24</ButtonGroupText>
  <Button aria-label="Next photo"><ChevronRight className="pa-i" aria-hidden /></Button>
</ButtonGroup>
```
