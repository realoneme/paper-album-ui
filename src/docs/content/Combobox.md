# Combobox

A searchable select: type into the groove, pick from the filtered list.

- React: `<Combobox label options value|defaultValue onValueChange emptyMessage icon>` from `@/components/ui/combobox`, built on cmdk inside a non-modal Radix Popover anchored to the input (`role="combobox"`; arrows move, Enter picks, Escape closes). Options are `{ value, label, description?, disabled?, keywords? }`; label and description are searched. Also `defaultSearch`, `listLabel`, `open`/`defaultOpen`, `hideLabel`.
- Empty message names the thing: "No place found."

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
