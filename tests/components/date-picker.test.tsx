import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { endSlide, mockSlideAnimations, readCss } from './support/slide-motion';
import userEvent from '@testing-library/user-event';
import { DatePicker, DateRangePicker, formatDate, formatDateRange } from '@/components/ui/date-picker';
import DatePickerDemo from '@/docs/demos/DatePicker.demo';

const oct = new Date(2026, 9, 1);
const today = new Date(2026, 9, 16);

describe('DatePicker', () => {
  it('formats dates and ranges', () => {
    expect(formatDate(new Date(2026, 9, 22))).toBe('Oct 22, 2026');
    expect(formatDateRange({ from: new Date(2026, 9, 20), to: new Date(2026, 9, 24) })).toBe('Oct 20 – Oct 24, 2026');
    expect(formatDateRange({ from: new Date(2026, 11, 30), to: new Date(2027, 0, 2) })).toBe('Dec 30, 2026 – Jan 2, 2027');
    expect(formatDateRange(undefined)).toBe('');
  });

  it('demo shows the range open without stealing focus', () => {
    render(<DatePickerDemo />);
    const trigger = screen.getByRole('button', { name: 'Trip dates Oct 20 – Oct 24, 2026' });
    expect(trigger).toHaveClass('pa-trigger');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAccessibleDescription('4 nights');
    expect(screen.getByRole('dialog', { name: 'Choose dates' })).toBeInTheDocument();
    expect(screen.getByRole('grid', { name: 'October 2026' })).toHaveClass('range');
    expect(screen.getByRole('button', { name: /October 20th, 2026/ })).toHaveClass('sel', 'start');
    expect(screen.getByRole('button', { name: /October 21st, 2026/ })).toHaveClass('mid');
    expect(screen.getByRole('button', { name: /October 24th, 2026/ })).toHaveClass('sel', 'end');
    expect(screen.getByRole('button', { name: /October 10th, 2026/ })).toBeDisabled();
    expect(document.activeElement).toBe(document.body);
  });

  it('picks a single date and closes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker aria-label="Shoot day" className="mine" defaultMonth={oct} today={today} onValueChange={onValueChange} />);
    const trigger = screen.getByRole('button', { name: 'Shoot day' });
    expect(trigger).toHaveClass('pa-trigger', 'mine');
    expect(trigger).toHaveTextContent('Pick a date');
    await user.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Choose a date' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /October 22nd, 2026/ }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect((onValueChange.mock.calls[0][0] as Date).getDate()).toBe(22);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveTextContent('Oct 22, 2026');
  });

  it('picks a range: start, then end closes the popover', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DateRangePicker aria-label="Trip" defaultMonth={oct} today={today} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button', { name: 'Trip' }));
    await user.click(screen.getByRole('button', { name: /October 20th, 2026/ }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /October 24th, 2026/ }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Trip' })).toHaveTextContent('Oct 20 – Oct 24, 2026');
    const last = onValueChange.mock.lastCall?.[0] as { from: Date; to: Date };
    expect(last.from.getDate()).toBe(20);
    expect(last.to.getDate()).toBe(24);
  });

  it('demo updates the nights caption', async () => {
    const user = userEvent.setup();
    render(<DatePickerDemo />);
    await user.click(screen.getByRole('button', { name: /October 27th, 2026/ }));
    expect(screen.getByText('7 nights')).toBeInTheDocument();
  });
});

describe('DatePicker motion', () => {
  afterEach(() => vi.restoreAllMocks());

  it.each([
    ['DatePicker', DatePicker, 'Choose a date'],
    ['DateRangePicker', DateRangePicker, 'Choose dates'],
  ] as const)('%s slides its popover up on close: data-state="closed" until the animation ends', async (_, Picker, dialog) => {
    mockSlideAnimations();
    const user = userEvent.setup();
    render(<Picker aria-label="When" defaultMonth={oct} today={today} />);
    await user.click(screen.getByRole('button', { name: 'When' }));
    const pop = screen.getByRole('dialog', { name: dialog });
    expect(pop).toHaveClass('pa-date-pop', 'pa-slide');
    expect(pop).toHaveAttribute('data-state', 'open');
    await user.keyboard('{Escape}');
    expect(pop).toHaveAttribute('data-state', 'closed');
    act(() => endSlide(pop));
    expect(pop).not.toBeInTheDocument();
  });

  it('unfolds from the trigger using the Radix popover origin', () => {
    expect(readCss('date-picker')).toContain('--pa-slide-origin: var(--radix-popover-content-transform-origin)');
  });
});
