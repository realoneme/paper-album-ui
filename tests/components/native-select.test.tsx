import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from '@/components/ui/native-select';
import NativeSelectDemo from '@/docs/demos/NativeSelect.demo';

describe('NativeSelect', () => {
  it('renders a labelled native select inside the groove wrapper', () => {
    render(<NativeSelectDemo />);
    const select = screen.getByRole('combobox', { name: 'Paper stock' });
    expect(select.tagName).toBe('SELECT');
    expect(select).toHaveClass('pa-select');
    expect(select).toHaveValue('cotton');
    expect(select.parentElement).toHaveClass('pa-select-wrap');
    expect(select.parentElement?.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('changes value when an option is picked', async () => {
    const onChange = vi.fn();
    render(
      <NativeSelect aria-label="Stock" defaultValue="a" onChange={onChange}>
        <NativeSelectOptGroup label="Matte">
          <NativeSelectOption value="a">Cotton</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOption value="b">Baryta</NativeSelectOption>
      </NativeSelect>,
    );
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Stock' }), 'Baryta');
    expect(screen.getByRole('combobox')).toHaveValue('b');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('group', { name: 'Matte' })).toBeInTheDocument();
  });

  it('merges className on the select and wrapperClassName on the wrapper, forwards ref', () => {
    const ref = { current: null as HTMLSelectElement | null };
    render(
      <NativeSelect ref={ref} aria-label="S" className="mine" wrapperClassName="wrap" disabled>
        <option>One</option>
      </NativeSelect>,
    );
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('pa-select', 'mine');
    expect(select).toBeDisabled();
    expect(select.parentElement).toHaveClass('pa-select-wrap', 'wrap');
    expect(ref.current).toBe(select);
  });
});
