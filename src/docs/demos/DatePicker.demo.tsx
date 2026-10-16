import * as React from 'react';
import { DatePicker, DateRangePicker, type DateRange } from '@/components/ui/date-picker';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'DatePicker', group: 'Forms', height: 440 };

const today = new Date(2026, 9, 16);
const DAY = 24 * 60 * 60 * 1000;

function nights(range: DateRange | undefined) {
  if (!range?.from || !range.to) return 'Choose a check-out day';
  const n = Math.round((range.to.getTime() - range.from.getTime()) / DAY);
  return n === 1 ? '1 night' : `${n} nights`;
}

export default function DatePickerDemo() {
  const id = React.useId();
  const [trip, setTrip] = React.useState<DateRange | undefined>({ from: new Date(2026, 9, 20), to: new Date(2026, 9, 24) });
  return (
    <div className="pa-stack" style={{ width: 260, gap: 24 }}>
      <div className="pa-col" style={{ gap: 8 }}>
        <span className="pa-label" id={`${id}-trip-label`}>Trip dates</span>
        <DateRangePicker
          id={`${id}-trip-dates`}
          aria-labelledby={`${id}-trip-label ${id}-trip-dates`}
          aria-describedby={`${id}-trip-nights`}
          value={trip}
          onValueChange={setTrip}
          defaultMonth={new Date(2026, 9, 1)}
          today={today}
          disabledDays={{ before: today }}
          defaultOpen
          side="right"
          sideOffset={24}
        />
        <span className="pa-caption" id={`${id}-trip-nights`}>{nights(trip)}</span>
      </div>
      <div className="pa-col" style={{ gap: 8 }}>
        <span className="pa-label" id={`${id}-shoot-label`}>Shoot day</span>
        <DatePicker
          id={`${id}-shoot-day`}
          aria-labelledby={`${id}-shoot-label ${id}-shoot-day`}
          defaultMonth={new Date(2026, 9, 1)}
          today={today}
          disabledDays={{ before: today }}
        />
      </div>
    </div>
  );
}
