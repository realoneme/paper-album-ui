# Tabs

Index-card tabs standing on a deep-wood rule; the selected tab is the deep card.

- React: `Tabs` (`defaultValue` or `value`/`onValueChange`), `TabsList` (give it an `aria-label`), `TabsTrigger value`, `TabsContent value` from `@/components/ui/tabs`, built on Radix Tabs: `tablist`/`tab`/`tabpanel` roles, `aria-selected`, arrow-key, Home and End navigation. Unselected cards sit on the deep rule; the selected one is taller.

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
