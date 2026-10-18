# Tabs

Index-card tabs standing on a deep-wood rule; the selected tab is the deep card.

- React: `Tabs` (`defaultValue` or `value`/`onValueChange`), `TabsList` (give it an `aria-label`), `TabsTrigger value`, `TabsContent value` from `@/components/ui/tabs`, built on Radix Tabs: `tablist`/`tab`/`tabpanel` roles, `aria-selected`, arrow-key, Home and End navigation. Unselected cards sit on the deep rule; the selected one is taller. When you pick a tab, its card is pulled up past its height (58px) and springs back to 51px, while the card it leaves settles down; the row has a fixed height, so the panel below never moves. Nothing animates on first render or with reduced motion.
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
