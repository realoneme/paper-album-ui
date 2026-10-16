import '@/styles/extra/calendar.css';
import * as React from 'react';
import { DayPicker, type DayButtonProps, type ChevronProps } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function CalendarChevron({ orientation }: ChevronProps) {
  const Icon = orientation === 'left' ? ChevronLeft : ChevronRight;
  return <Icon className="pa-i sm" aria-hidden />;
}

/** Puts the day state classes (`out`, `today`, `sel`, `start`, `mid`, `end`) on the button, where pa-cal-grid styles them. */
function CalendarDayButton({ day: _day, modifiers, className, ...props }: DayButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  const single = modifiers.selected && !modifiers.range_start && !modifiers.range_middle && !modifiers.range_end;
  return (
    <button
      ref={ref}
      className={cn(
        className,
        modifiers.outside && 'out',
        modifiers.today && 'today',
        (single || modifiers.range_start || modifiers.range_end) && 'sel',
        modifiers.range_start && !modifiers.range_end && 'start',
        modifiers.range_middle && 'mid',
        modifiers.range_end && !modifiers.range_start && 'end',
      )}
      aria-pressed={modifiers.selected ? true : undefined}
      {...props}
    />
  );
}

/**
 * A month grid on react-day-picker. Today is ringed in wood, the selected day is a deep-wood tile.
 * Supports `mode="single" | "multiple" | "range"`, `disabled` matchers, `month`/`today`, `weekStartsOn`.
 */
export function Calendar({ className, classNames, components, showOutsideDays = true, ...props }: CalendarProps) {
  const isRange = props.mode === 'range';
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      navLayout="around"
      className={cn('pa-pop pa-cal', className)}
      classNames={{
        root: 'pa-cal-root',
        months: 'pa-cal-months',
        month: 'pa-cal-month',
        month_caption: 'pa-cal-head',
        caption_label: 'pa-cal-caption',
        button_previous: cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'pa-btn-sm pa-cal-nav pa-cal-nav-prev'),
        button_next: cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'pa-btn-sm pa-cal-nav pa-cal-nav-next'),
        month_grid: cn('pa-cal-grid', isRange && 'range'),
        weekday: 'dow',
        day: 'pa-cal-day',
        day_button: 'pa-cal-day-btn',
        hidden: 'pa-cal-hidden',
        ...classNames,
      }}
      components={{ Chevron: CalendarChevron, DayButton: CalendarDayButton, ...components }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';
