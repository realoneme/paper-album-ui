# Accordion

Stacked questions that open one panel at a time into a sunken well.

- React: `Accordion` (`type="single"` + `collapsible`, or `type="multiple"`; `defaultValue`/`value`), `AccordionItem value`, `AccordionTrigger` (button in an `h3`, `aria-expanded`), `AccordionContent` (labelled region) from `@/components/ui/accordion`, built on Radix Accordion.

```tsx
<Accordion type="single" collapsible defaultValue="delivery">
  <AccordionItem value="delivery">
    <AccordionTrigger>How soon will I see my photos?</AccordionTrigger>
    <AccordionContent>A preview gallery arrives within 3 days.</AccordionContent>
  </AccordionItem>
</Accordion>
```
