# Date Picker

A trigger that shows the chosen date and opens a Calendar in a popover; supports ranges.

- React: `<DatePicker value|defaultValue onValueChange>` (closes on pick) and `<DateRangePicker value|defaultValue onValueChange numberOfMonths>` (closes once both ends are chosen) from `@/components/ui/date-picker`. Shared: `placeholder`, `defaultMonth`, `today`, `disabledDays`, `open`/`defaultOpen`/`onOpenChange`, `side`/`align`/`sideOffset`, plus button props for labelling. The popover is non-modal; focus moves to the selected day when the user opens it. `formatDate` / `formatDateRange` give "Oct 20 – Oct 24, 2026".
- Name the trigger with its label and value, e.g. `aria-labelledby="label-id trigger-id"`.

```tsx
<span className="pa-label" id="trip-label">Trip dates</span>
<DateRangePicker id="trip" aria-labelledby="trip-label trip" value={trip} onValueChange={setTrip} disabledDays={{ before: new Date() }} />
```
