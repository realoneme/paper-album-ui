# Avatar

A round portrait with a paper rim; falls back to initials on wood or deep wood. Groups overlap by 10px.

- React: `Avatar` (Radix; `size="xs" | "sm" | "default" | "lg"` = 24 / 32 / 44 / 56px, `tone="default" | "deep"`), `AvatarImage`, `AvatarFallback` (initials), `AvatarGroup` (role group; give it an `aria-label`), `AvatarGroupCount` for "+4". Add `className="photo"` for the placeholder gradient.

```tsx
<Avatar role="img" aria-label="Diego Ruiz">
  <AvatarImage src={diego} alt="" />
  <AvatarFallback>DR</AvatarFallback>
</Avatar>
```
