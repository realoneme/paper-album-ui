import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import ComboboxDemo from '@/docs/demos/Combobox.demo';

const places: ComboboxOption[] = [
  { value: 'kyoto', label: 'Kyoto', description: 'Japan' },
  { value: 'skye', label: 'Isle of Skye', description: 'Scotland' },
  { value: 'lisbon', label: 'Lisbon', description: 'Portugal' },
  { value: 'closed', label: 'Atlantis', disabled: true },
];

describe('Combobox', () => {
  it('demo opens filtered by "Ky" without taking focus', () => {
    render(<ComboboxDemo />);
    const input = screen.getByRole('combobox', { name: 'Location' });
    expect(input).toHaveValue('Ky');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(input.closest('.pa-igroup')).not.toBeNull();
    expect(document.activeElement).toBe(document.body);
    const list = screen.getByRole('listbox', { name: 'Locations' });
    expect(list.closest('.pa-pop')).toHaveClass('pa-menu');
    const names = within(list).getAllByRole('option').map((o) => o.textContent);
    expect(names).toEqual(['KyotoJapan', 'Isle of SkyeScotland']);
    expect(within(list).getByRole('option', { name: /Kyoto/ })).toHaveClass('pa-mi', 'on');
  });

  it('filters while typing and shows the empty message', async () => {
    const user = userEvent.setup();
    render(<Combobox label="Location" options={places} emptyMessage="No place found." />);
    const input = screen.getByRole('combobox', { name: 'Location' });
    expect(input).toHaveAttribute('aria-expanded', 'false');
    await user.type(input, 'lisb');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option', { name: /Lisbon/ })).toBeInTheDocument();
    await user.clear(input);
    await user.type(input, 'zzz');
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByText('No place found.')).toBeInTheDocument();
  });

  it('picks an option by click and by keyboard', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Combobox label="Location" options={places} onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.click(screen.getByRole('option', { name: /Isle of Skye/ }));
    expect(onValueChange).toHaveBeenLastCalledWith('skye', places[1]);
    expect(input).toHaveValue('Isle of Skye');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await user.clear(input);
    await user.type(input, 'ky');
    await user.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith('kyoto', places[0]);
    expect(input).toHaveValue('Kyoto');
  });

  it('opens with ArrowDown, closes with Escape and skips disabled options', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Combobox label="Location" options={places} onValueChange={onValueChange} />);
    screen.getByRole('combobox').focus();
    await user.keyboard('{ArrowDown}');
    const disabled = screen.getByRole('option', { name: /Atlantis/ });
    expect(disabled).toHaveAttribute('aria-disabled', 'true');
    await user.click(disabled);
    expect(onValueChange).not.toHaveBeenCalled();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('merges className onto the groove and wrapperClassName onto the root', () => {
    render(<Combobox label="Where" options={places} className="groove" wrapperClassName="outer" />);
    const input = screen.getByRole('combobox', { name: 'Where' });
    expect(input.closest('.pa-igroup')).toHaveClass('groove');
    expect(input.closest('.pa-combobox')).toHaveClass('outer');
  });
});
