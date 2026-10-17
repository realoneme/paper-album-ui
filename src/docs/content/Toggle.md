# Toggle

A two-state button that presses into the paper when on.

- React: `<Toggle>` (Radix Toggle) with `pressed` / `defaultPressed` / `onPressedChange` and `disabled`; renders `aria-pressed`. Children are an icon + label. On state uses `muted` + `shadow-sunken`.
- Motion: pressing sinks the key 2px while the fill and shadow move from `shadow-key` to `shadow-sunken` (`--dur-fast`, `--ease-paper`); releasing lifts it back with a slight spring (`--dur-base`, `--ease-spring`). With `prefers-reduced-motion` the state changes instantly.
- Do: use for view options (show captions, show EXIF). Don't: use for navigation or for settings that need a save.

```tsx
<Toggle pressed={captions} onPressedChange={setCaptions}>
  <List className="pa-i" aria-hidden />Captions
</Toggle>
```
