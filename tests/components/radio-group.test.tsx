import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

function Sizes(props: { onValueChange?: (v: string) => void }) {
  return (
    <RadioGroup aria-label="Print size" defaultValue="a3" className="extra" onValueChange={props.onValueChange}>
      <RadioGroupItem value="a4">A4</RadioGroupItem>
      <RadioGroupItem value="a3">A3</RadioGroupItem>
      <RadioGroupItem value="square" disabled>Square</RadioGroupItem>
    </RadioGroup>
  );
}

describe('RadioGroup', () => {
  it('renders a named radiogroup of paper slips', () => {
    render(<Sizes />);
    const group = screen.getByRole('radiogroup', { name: 'Print size' });
    expect(group).toHaveClass('pa-stack', 'pa-radio-group', 'extra');
    const a3 = screen.getByRole('radio', { name: 'A3' });
    expect(a3).toHaveClass('pa-radio');
    expect(a3).toHaveAttribute('aria-checked', 'true');
    expect(a3.querySelector('.dot')).not.toBeNull();
  });

  it('selects on click', async () => {
    const onValueChange = vi.fn();
    render(<Sizes onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('radio', { name: 'A4' }));
    expect(onValueChange).toHaveBeenLastCalledWith('a4');
    expect(screen.getByRole('radio', { name: 'A4' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'A3' })).toHaveAttribute('aria-checked', 'false');
  });

  it('moves focus and selection with arrow keys', async () => {
    render(<Sizes />);
    await userEvent.tab();
    expect(screen.getByRole('radio', { name: 'A3' })).toHaveFocus();
    // Hold the key: Radix moves focus on a timer and selects only while an arrow key is down.
    await userEvent.keyboard('{ArrowUp>}');
    const a4 = screen.getByRole('radio', { name: 'A4' });
    await waitFor(() => expect(a4).toHaveFocus());
    expect(a4).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{/ArrowUp}');
  });

  it('skips disabled options', async () => {
    render(<Sizes />);
    const square = screen.getByRole('radio', { name: 'Square' });
    expect(square).toBeDisabled();
    await userEvent.click(square);
    expect(square).toHaveAttribute('aria-checked', 'false');
  });

  it('keeps every dot mounted and flips its data-state', async () => {
    render(<Sizes />);
    const a3 = screen.getByRole('radio', { name: 'A3' });
    const a4 = screen.getByRole('radio', { name: 'A4' });
    const a3Fill = a3.querySelector('.pa-radio-fill');
    const a4Fill = a4.querySelector('.pa-radio-fill');
    expect(a3Fill).toHaveAttribute('data-state', 'checked');
    expect(a4Fill).toHaveAttribute('data-state', 'unchecked');
    await userEvent.click(a4);
    expect(a4.querySelector('.pa-radio-fill')).toBe(a4Fill);
    expect(a3.querySelector('.pa-radio-fill')).toBe(a3Fill);
    expect(a4Fill).toHaveAttribute('data-state', 'checked');
    expect(a3Fill).toHaveAttribute('data-state', 'unchecked');
  });
});
