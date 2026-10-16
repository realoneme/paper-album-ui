# Tooltip

A short deep-wood label for icon-only buttons. One short phrase, no punctuation.

- React: `Tooltip` (includes its own provider), `TooltipTrigger`, `TooltipContent` (`container`, `side`, `sideOffset`), `TooltipProvider` (shared `delayDuration`) from `@/components/ui/tooltip`, built on Radix Tooltip: opens on hover and focus, closes on Escape, linked with `aria-describedby`. The icon button still needs its own `aria-label`.

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="secondary" size="icon" aria-label="Download"><Download className="pa-i" aria-hidden /></Button>
  </TooltipTrigger>
  <TooltipContent>Download original</TooltipContent>
</Tooltip>
```
