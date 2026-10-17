# Tooltip

A short deep-wood label for icon-only buttons. One short phrase, no punctuation.

- React: `Tooltip` (includes its own provider), `TooltipTrigger`, `TooltipContent` (`container`, `side`, `sideOffset`), `TooltipProvider` (shared `delayDuration`) from `@/components/ui/tooltip`, built on Radix Tooltip: opens on hover and focus, closes on Escape, linked with `aria-describedby`. The icon button still needs its own `aria-label`.
- Tooltip names an icon button; phones cannot hover, so never put information there that the reader needs. To explain a setting use Help Tip, which also opens on a tap.

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="secondary" size="icon" aria-label="Download"><Download className="pa-i" aria-hidden /></Button>
  </TooltipTrigger>
  <TooltipContent>Download original</TooltipContent>
</Tooltip>
```

## Timing and motion

- Opens immediately: `TooltipProvider` defaults to `delayDuration={0}` and `skipDelayDuration={0}` (pass your own to slow it down).
- A fast pop: 110ms scale, fade and 4px slide from the trigger side; out in 80ms. Reduced motion: a fade only.

```tsx
{/* Shared provider for a toolbar; still no delay unless you set one. */}
<TooltipProvider delayDuration={0}>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="secondary" size="icon" aria-label="Share"><Share className="pa-i" aria-hidden /></Button>
    </TooltipTrigger>
    <TooltipContent side="bottom">Copy share link</TooltipContent>
  </Tooltip>
</TooltipProvider>
```
