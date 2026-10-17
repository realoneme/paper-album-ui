# Switch

An on/off control for settings that apply at once: a print-white knob in a sunken track that turns wood when on.

- React: `<Switch checked onCheckedChange disabled size>` (Radix Switch; renders `role="switch"` + `aria-checked`). Label it with `<Label htmlFor>` or `aria-label`.
- Sizes: `sm` 36×20 for dense rows and tables, `default` 44×24, `lg` 64×36 for one prominent setting. Every size keeps a tap target at least 44px tall (an invisible area around the track).

```tsx
<Switch id="show-captions" checked={captions} onCheckedChange={setCaptions} />
<Label htmlFor="show-captions">Show captions</Label>
```
