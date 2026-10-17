# Help Tip

A small "?" beside a label that explains a setting in a sentence or two (a toggletip).

- Use it for "what does this mean?" next to a label, a heading or a table column. To name an icon button use Tooltip; for a paragraph or more use the field's description or a Sheet.
- React: `<HelpTip label>` from `@/components/ui/help-tip`, built on Radix Popover. `label` is the button's accessible name and the bubble's label ("About watermarks"); children are the help (plain `<p>`s, optionally a "Learn more" link). Also `side`, `align`, `open`/`defaultOpen`/`onOpenChange`, `container`.
- Opening: hovering with a mouse opens it at once and leaving closes it (moving into the bubble keeps it); a tap or click toggles it, so it works the same on phones; a click after a hover-open pins it open. Enter or Space opens it from the keyboard, Escape or a click elsewhere closes it. Focus stays on the "?".
- The key is 24px with a 44×44 tap target; the bubble is a narrow popover sheet (`max-width` 280px) whose pointer aims at the key.

```tsx
<span className="pa-row" style={{ gap: 6 }}>
  <Switch id="watermark" defaultChecked />
  <Label htmlFor="watermark">Show watermark</Label>
  <HelpTip label="About watermarks">
    <p>Your studio name is printed faintly in the corner of web-size images.</p>
  </HelpTip>
</span>
```
