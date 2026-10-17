import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '@/components/ui/checkbox';

describe('Checkbox', () => {
  it('renders a named checkbox with the paper classes', () => {
    render(<Checkbox className="extra">Gift wrap</Checkbox>);
    const box = screen.getByRole('checkbox', { name: 'Gift wrap' });
    expect(box).toHaveClass('pa-check', 'extra');
    expect(box).toHaveAttribute('aria-checked', 'false');
    expect(box.querySelector('.box')).not.toBeNull();
  });

  it('toggles with click and Space', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox onCheckedChange={onCheckedChange}>Order printed copy</Checkbox>);
    const box = screen.getByRole('checkbox', { name: 'Order printed copy' });
    await userEvent.click(box);
    expect(box).toHaveAttribute('aria-checked', 'true');
    expect(box.querySelector('.pa-check-tick')).not.toBeNull();
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    await userEvent.keyboard(' ');
    expect(box).toHaveAttribute('aria-checked', 'false');
  });

  it('renders the indeterminate state as mixed', () => {
    render(<Checkbox checked="indeterminate">Select all</Checkbox>);
    const box = screen.getByRole('checkbox', { name: 'Select all' });
    expect(box).toHaveAttribute('aria-checked', 'mixed');
    expect(box).toHaveAttribute('data-state', 'indeterminate');
  });

  it('ignores clicks when disabled', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox disabled onCheckedChange={onCheckedChange}>Gift wrap</Checkbox>);
    const box = screen.getByRole('checkbox', { name: 'Gift wrap' });
    expect(box).toBeDisabled();
    await userEvent.click(box);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('keeps the indicator mounted and keyed on data-state', async () => {
    render(<Checkbox>Gift wrap</Checkbox>);
    const box = screen.getByRole('checkbox', { name: 'Gift wrap' });
    const indicator = box.querySelector('.pa-check-indicator');
    expect(indicator).not.toBeNull();
    expect(indicator).toHaveAttribute('data-state', 'unchecked');
    expect(box.querySelector('.pa-check-tick')).not.toBeNull();
    expect(box.querySelector('.box')).not.toHaveAttribute('data-pop');
    await userEvent.click(box);
    expect(box.querySelector('.pa-check-indicator')).toBe(indicator);
    expect(indicator).toHaveAttribute('data-state', 'checked');
    expect(box.querySelector('.box')).toHaveAttribute('data-pop', 'a');
    await userEvent.click(box);
    expect(indicator).toHaveAttribute('data-state', 'unchecked');
    expect(box.querySelector('.box')).toHaveAttribute('data-pop', 'b');
  });

  it('pops on controlled changes and shows the dash when indeterminate', () => {
    const { rerender } = render(<Checkbox checked={false}>Select all</Checkbox>);
    const box = screen.getByRole('checkbox', { name: 'Select all' });
    expect(box.querySelector('.box')).not.toHaveAttribute('data-pop');
    rerender(<Checkbox checked="indeterminate">Select all</Checkbox>);
    expect(box.querySelector('.pa-check-indicator')).toHaveAttribute('data-state', 'indeterminate');
    expect(box.querySelector('.pa-check-dash')).not.toBeNull();
    expect(box.querySelector('.box')).toHaveAttribute('data-pop', 'a');
  });

  it('forwards the ref to the button', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Checkbox ref={ref}>Gift wrap</Checkbox>);
    expect(ref.current).toBe(screen.getByRole('checkbox'));
  });
});
