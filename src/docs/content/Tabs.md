# Tabs

Index-card tabs standing on a deep-wood rule; the selected tab is the deep card.

- React: `Tabs` (`defaultValue` or `value`/`onValueChange`), `TabsList` (give it an `aria-label`), `TabsTrigger value`, `TabsContent value` from `@/components/ui/tabs`, built on Radix Tabs: `tablist`/`tab`/`tabpanel` roles, `aria-selected`, arrow-key, Home and End navigation. Unselected cards sit on the deep rule; the selected one is taller.
- Stable height: every panel stays mounted in one shared cell under the list (inactive panels hidden, also from screen readers), so the panel area is as tall as the tallest panel and switching tabs never pushes the page below. Only the cards move. Pass `keepHeight={false}` on `TabsContent` to mount only the selected panel (for heavy panels).
- Narrow screens: when the tabs do not fit, the row scrolls sideways (no scrollbar), the side with more tabs fades out, and the selected tab scrolls into view.

```tsx
<Tabs defaultValue="photos">
  <TabsList aria-label="Album sections">
    <TabsTrigger value="photos">Photos</TabsTrigger>
    <TabsTrigger value="story">Story</TabsTrigger>
  </TabsList>
  <TabsContent value="photos">…</TabsContent>
  <TabsContent value="story">…</TabsContent>
</Tabs>
```
