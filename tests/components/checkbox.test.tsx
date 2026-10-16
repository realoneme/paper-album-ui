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
});
