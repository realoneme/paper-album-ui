import '@/styles/extra/date-picker.css';
import * as React from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import type { DateRange, Matcher } from 'react-day-picker';
import { CalendarDays } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/cn';

export type { DateRange };

const dayFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const fullFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/** "Oct 22, 2026" */
export function formatDate(date: Date | undefined): string {
  return date ? fullFmt.format(date) : '';
}

/** "Oct 20 – Oct 24, 2026", or with both years when they differ. */
export function formatDateRange(range: DateRange | undefined): string {
  if (!range?.from) return '';
  const { from, to } = range;
  if (!to) return `${fullFmt.format(from)} – …`;
  if (from.getFullYear() === to.getFullYear()) return `${dayFmt.format(from)} – ${fullFmt.format(to)}`;
  return `${fullFmt.format(from)} – ${fullFmt.format(to)}`;
}

interface PickerBaseProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'defaultValue' | 'onChange'> {
  /** Text when nothing is chosen. */
  placeholder?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Month shown when the popover first opens (defaults to the chosen date). */
  defaultMonth?: Date;
  /** Override "today" (useful for tests and demos). */
  today?: Date;
  /** Days that cannot be chosen. */
  disabledDays?: Matcher | Matcher[];
  side?: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>['side'];
  align?: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>['align'];
  sideOffset?: number;
}

interface PickerShellProps extends PickerBaseProps {
  text: string;
  dialogLabel: string;
  renderCalendar: (autoFocus: boolean) => React.ReactNode;
  openState: [boolean, (open: boolean) => void];
}

const PickerShell = React.forwardRef<HTMLButtonElement, PickerShellProps>(
  ({ className, text, placeholder, dialogLabel, renderCalendar, openState, side = 'bottom', align = 'start', sideOffset = 8, ...props }, ref) => {
    const [open, setOpen] = openState;
    // The popover may start open (docs demos); only move focus into it once the user opens it.
    const [userOpened, setUserOpened] = React.useState(false);
    return (
      <PopoverPrimitive.Root
        open={open}
        onOpenChange={(next) => {
          if (next) setUserOpened(true);
          setOpen(next);
        }}
      >
        <PopoverPrimitive.Trigger asChild>
          <button ref={ref} type="button" className={cn('pa-trigger pa-date-trigger', !text && 'is-empty', className)} {...props}>
            <span className="pa-date-text">
              <CalendarDays className="pa-i" aria-hidden />
              <span>{text || placeholder}</span>
            </span>
          </button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            className="pa-date-pop"
            side={side}
            align={align}
            sideOffset={sideOffset}
            aria-label={dialogLabel}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {renderCalendar(userOpened)}
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
  },
);
PickerShell.displayName = 'PickerShell';

function useOpen(open: boolean | undefined, defaultOpen: boolean | undefined, onOpenChange?: (open: boolean) => void) {
  const [inner, setInner] = React.useState(defaultOpen ?? false);
  const value = open ?? inner;
  const set = React.useCallback(
    (next: boolean) => {
      if (open === undefined) setInner(next);
      onOpenChange?.(next);
    },
    [open, onOpenChange],
  );
  return [value, set] as [boolean, (open: boolean) => void];
}

export interface DatePickerProps extends PickerBaseProps {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;
}

/** A paper key showing the chosen date; opens a Calendar in a popover and closes on pick. */
export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  ({ value, defaultValue, onValueChange, placeholder = 'Pick a date', open, defaultOpen, onOpenChange, defaultMonth, today, disabledDays, ...props }, ref) => {
    const [inner, setInner] = React.useState<Date | undefined>(defaultValue);
    const date = value !== undefined ? value : inner;
    const openState = useOpen(open, defaultOpen, onOpenChange);
    return (
      <PickerShell
        ref={ref}
        {...props}
        placeholder={placeholder}
        text={formatDate(date)}
        dialogLabel="Choose a date"
        openState={openState}
        renderCalendar={(autoFocus) => (
          <Calendar
            mode="single"
            autoFocus={autoFocus}
            selected={date}
            defaultMonth={defaultMonth ?? date}
            today={today}
            disabled={disabledDays}
            onSelect={(d) => {
              if (value === undefined) setInner(d);
              onValueChange?.(d);
              openState[1](false);
            }}
          />
        )}
      />
    );
  },
);
DatePicker.displayName = 'DatePicker';

const isSpan = (r: DateRange | undefined) => Boolean(r?.from && r.to && r.from.getTime() !== r.to.getTime());

export interface DateRangePickerProps extends PickerBaseProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange | undefined) => void;
  /** Months shown side by side. */
  numberOfMonths?: number;
}

/** Like DatePicker for a from–to range; closes once both ends are chosen. */
export const DateRangePicker = React.forwardRef<HTMLButtonElement, DateRangePickerProps>(
  ({ value, defaultValue, onValueChange, placeholder = 'Pick dates', open, defaultOpen, onOpenChange, defaultMonth, today, disabledDays, numberOfMonths, ...props }, ref) => {
    const [inner, setInner] = React.useState<DateRange | undefined>(defaultValue);
    const range = value !== undefined ? value : inner;
    const openState = useOpen(open, defaultOpen, onOpenChange);
    return (
      <PickerShell
        ref={ref}
        {...props}
        placeholder={placeholder}
        text={formatDateRange(range)}
        dialogLabel="Choose dates"
        openState={openState}
        renderCalendar={(autoFocus) => (
          <Calendar
            mode="range"
            autoFocus={autoFocus}
            selected={range}
            defaultMonth={defaultMonth ?? range?.from}
            today={today}
            disabled={disabledDays}
            numberOfMonths={numberOfMonths}
            onSelect={(next) => {
              if (value === undefined) setInner(next);
              onValueChange?.(next);
              if (isSpan(next) && !isSpan(range)) openState[1](false);
            }}
          />
        )}
      />
    );
  },
);
DateRangePicker.displayName = 'DateRangePicker';
