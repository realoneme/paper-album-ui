# Calendar

A month grid. Today is ringed in wood, the selected day is a deep-wood tile.

- React: `<Calendar mode="single|multiple|range" selected onSelect month|defaultMonth today disabled weekStartsOn numberOfMonths>` from `@/components/ui/calendar` — react-day-picker v9 with its classes mapped onto `pa-cal` (no default CSS). Week starts on Sunday by default; day buttons carry full labels ("Friday, October 16th, 2026") and `aria-pressed` when selected. Ranges show `start`/`mid`/`end`. Today is bold with a small wood dot under the number (light on a selected day), so it never crowds the days beside it.

```tsx
<Calendar mode="single" selected={day} onSelect={setDay} defaultMonth={new Date(2026, 9, 1)} disabled={{ before: new Date() }} />
```
