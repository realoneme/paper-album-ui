import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { Input } from '@/components/ui/input';

describe('Input', () => {
  it('renders a text input with merged classes and forwards ref', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="Name" className="extra" placeholder="[Name]" />);
    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toHaveClass('pa-input', 'extra');
    expect(input).toHaveAttribute('type', 'text');
    expect(ref.current).toBe(input);
  });

  it('accepts typing', async () => {
    const onChange = vi.fn();
    render(<Input aria-label="Name" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'Aiko');
    expect(screen.getByRole('textbox')).toHaveValue('Aiko');
    expect(onChange).toHaveBeenCalledTimes(4);
  });

  it('is not editable when disabled', async () => {
    render(<Input aria-label="Disabled field" defaultValue="Pickup only" disabled />);
    const input = screen.getByRole('textbox', { name: 'Disabled field' });
    expect(input).toBeDisabled();
    await userEvent.type(input, 'x');
    expect(input).toHaveValue('Pickup only');
  });
});
