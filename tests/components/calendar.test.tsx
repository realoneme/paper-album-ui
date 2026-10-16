import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calendar } from '@/components/ui/calendar';
import CalendarDemo from '@/docs/demos/Calendar.demo';

const oct = new Date(2026, 9, 1);
const today = new Date(2026, 9, 16);

describe('Calendar', () => {
  it('renders October 2026 as a labelled grid with Sunday first', () => {
    render(<CalendarDemo />);
    const grid = screen.getByRole('grid', { name: 'October 2026' });
    expect(grid).toHaveClass('pa-cal-grid');
    expect(grid.closest('.pa-cal')).toHaveClass('pa-pop');
    const headers = grid.querySelectorAll('th.dow');
    expect(headers).toHaveLength(7);
    expect(headers[0]).toHaveTextContent('Su');
    expect(headers[0]).toHaveAttribute('aria-label', 'Sunday');
    expect(screen.getByRole('button', { name: /Previous month/i })).toHaveClass('pa-btn', 'pa-btn-secondary');
    expect(screen.getByRole('button', { name: /Next month/i })).toBeInTheDocument();
  });

  it('marks today, the selected day and outside days on the buttons', () => {
    render(<CalendarDemo />);
    expect(screen.getByRole('button', { name: /October 16th, 2026/ })).toHaveClass('today');
    const sel = screen.getByRole('button', { name: /October 22nd, 2026/ });
    expect(sel).toHaveClass('sel');
    expect(sel).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /September 27th, 2026/ })).toHaveClass('out');
  });

  it('chooses a day', async () => {
    const onSelect = vi.fn();
    render(<Calendar mode="single" month={oct} today={today} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: /October 9th, 2026/ }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    const picked = onSelect.mock.calls[0][0] as Date;
    expect(picked.getFullYear()).toBe(2026);
    expect(picked.getMonth()).toBe(9);
    expect(picked.getDate()).toBe(9);
  });

  it('demo moves the selection and navigates months', async () => {
    render(<CalendarDemo />);
    await userEvent.click(screen.getByRole('button', { name: /October 9th, 2026/ }));
    expect(screen.getByRole('button', { name: /October 9th, 2026/ })).toHaveClass('sel');
    expect(screen.getByRole('button', { name: /October 22nd, 2026/ })).not.toHaveClass('sel');
    await userEvent.click(screen.getByRole('button', { name: /Next month/i }));
    expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
  });

  it('styles ranges with start, mid and end', () => {
    render(
      <Calendar mode="range" month={oct} today={today} selected={{ from: new Date(2026, 9, 20), to: new Date(2026, 9, 24) }} />,
    );
    expect(screen.getByRole('grid')).toHaveClass('range');
    expect(screen.getByRole('button', { name: /October 20th, 2026/ })).toHaveClass('sel', 'start');
    expect(screen.getByRole('button', { name: /October 22nd, 2026/ })).toHaveClass('mid');
    expect(screen.getByRole('button', { name: /October 24th, 2026/ })).toHaveClass('sel', 'end');
  });

  it('merges className and disables days', () => {
    const { container } = render(
      <Calendar mode="single" month={oct} today={today} className="mine" disabled={{ before: today }} />,
    );
    expect(container.querySelector('.pa-cal')).toHaveClass('mine');
    expect(screen.getByRole('button', { name: /October 10th, 2026/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /October 17th, 2026/ })).toBeEnabled();
  });
});
