# Accordion

Stacked questions; each opens its own answer in a sunken well, and opening one leaves the others as they are.

- React: `Accordion` (each panel opens on its own by default, `type="multiple"` with an array `defaultValue`/`value`; pass `type="single"` + `collapsible` for one at a time), `AccordionItem value`, `AccordionTrigger` (button in an `h3`, `aria-expanded`), `AccordionContent` (labelled region) from `@/components/ui/accordion`, built on Radix Accordion.
- Motion: a panel unfolds to its height (`--dur-base`, `--ease-paper`) while its sunken well settles in with a 4px drop, and folds away faster (`--dur-fast`, `--ease-in-paper`); the chevron turns with the same timing. Panels open on first render do not animate. Reduced motion: instant.

```tsx
<Accordion defaultValue={['delivery']}>
  <AccordionItem value="delivery">
    <AccordionTrigger>How soon will I see my photos?</AccordionTrigger>
    <AccordionContent>A preview gallery arrives within 3 days.</AccordionContent>
  </AccordionItem>
</Accordion>
```
