# Separator

A 1px `border` rule, horizontal or vertical; between sections of a page use a cut-paper wave instead.

- React: `Separator` from `@/components/ui/separator` (Radix Separator) — `orientation` (`horizontal` default, `vertical`), `decorative` (default `true`; pass `false` to expose `role="separator"` when it divides content semantically), `variant="wave"` for the cut-paper wave between page sections.

```tsx
<Separator />
<span>24 photos</span><Separator orientation="vertical" decorative={false} /><span>2026</span>
<Separator variant="wave" />
```
