# Resizable

Panels split by a draggable crease; vertical and horizontal handles.

- React: `ResizablePanelGroup direction`, `ResizablePanel` (`defaultSize`, `minSize`…; `bare` drops the pane padding for a nested group), `ResizableHandle` (give it an `aria-label`; the crease look follows the group's direction) from `@/components/ui/resizable`, built on react-resizable-panels: handles are `role="separator"`, focusable, and move with the arrow keys, Home and End.

```tsx
<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={32}>Albums</ResizablePanel>
  <ResizableHandle aria-label="Resize panels" />
  <ResizablePanel defaultSize={68}>Preview</ResizablePanel>
</ResizablePanelGroup>
```
