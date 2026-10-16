import * as React from 'react';
import { Calendar } from '@/components/ui/calendar';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Calendar', group: 'Forms', height: 380 };

export default function CalendarDemo() {
  const [selected, setSelected] = React.useState<Date | undefined>(new Date(2026, 9, 22));
  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={setSelected}
      defaultMonth={new Date(2026, 9, 1)}
      today={new Date(2026, 9, 16)}
    />
  );
}
