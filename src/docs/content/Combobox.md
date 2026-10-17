# Combobox

A searchable select: type into the groove, pick from the filtered list.

- React: `<Combobox label options value|defaultValue onValueChange emptyMessage icon>` from `@/components/ui/combobox`, built on cmdk inside a non-modal Radix Popover anchored to the input (`role="combobox"`; arrows move, Enter picks, Escape closes). Options are `{ value, label, description?, disabled?, keywords? }`; label and description are searched. Also `defaultSearch`, `listLabel`, `open`/`defaultOpen`, `hideLabel`.
- Empty message names the thing: "No place found."
- Highlight: cmdk's `[data-selected="true"]` (tint plus ring, since focus stays in the input) follows the pointer and the arrow keys. The chosen value is marked `data-checked` and shows only its check mark; it is never tinted, so it cannot compete with the moving highlight. (The old `on` class is gone.)
- Motion: the list slides down from the groove (`--radix-popover-content-transform-origin`, `--dur-base`, `--ease-paper`) and slides back up on close; it slides up when it opens above. Reduced motion: fade only.

```tsx
<Combobox
  label="Location"
  options={[{ value: 'kyoto', label: 'Kyoto', description: 'Japan' }]}
  value={place}
  onValueChange={setPlace}
  emptyMessage="No place found."
  icon={<MapPin className="pa-i" aria-hidden />}
/>
```
