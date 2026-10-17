# Collapsible

One block that opens and closes, for optional detail such as camera settings.

- React: `Collapsible` (`defaultOpen` or `open`/`onOpenChange`), `CollapsibleTrigger` (optional `icon`; full-width with a turning chevron, `aria-expanded`; `asChild` renders your own element as-is), `CollapsibleContent` (two-column grid; put `.cell` tiles inside) from `@/components/ui/collapsible`, built on Radix Collapsible.
- Motion: the body folds open and shut like an Accordion panel (height from Radix's `--radix-collapsible-content-height`, `--dur-base` in, `--dur-fast` out). Reduced motion: instant.

```tsx
<Collapsible defaultOpen>
  <CollapsibleTrigger icon={<Camera className="pa-i" aria-hidden />}>Camera settings</CollapsibleTrigger>
  <CollapsibleContent>
    <div className="cell"><div className="pa-caption">Shutter</div><b>1/250 s</b></div>
  </CollapsibleContent>
</Collapsible>
```
