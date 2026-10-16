# Native Select

The browser's own select, restyled as a groove with a chevron. Prefer it on phones and for long lists.

- React: `<NativeSelect>` (a real `<select>`, ref and all native props; `className` on the select, `wrapperClassName` on the `pa-select-wrap`), `NativeSelectOption`, `NativeSelectOptGroup` from `@/components/ui/native-select`. Tie a label by wrapping it in `<label>` or with `htmlFor`.

```tsx
<label className="pa-field">
  <span className="pa-label">Paper stock</span>
  <NativeSelect defaultValue="cotton">
    <NativeSelectOption value="cotton">Cotton rag, matte</NativeSelectOption>
    <NativeSelectOption value="baryta">Baryta, satin</NativeSelectOption>
  </NativeSelect>
</label>
```
