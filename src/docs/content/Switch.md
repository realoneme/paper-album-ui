# Switch

An on/off control for settings that apply at once: a print-white knob in a sunken track that turns wood when on.

- React: `<Switch checked onCheckedChange disabled>` (Radix Switch; renders `role="switch"` + `aria-checked`). Label it with `<Label htmlFor>` or `aria-label`.

```tsx
<Switch id="show-captions" checked={captions} onCheckedChange={setCaptions} />
<Label htmlFor="show-captions">Show captions</Label>
```
