import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SelectDemo from '@/docs/demos/Select.demo';

function Genre({ onValueChange }: { onValueChange?: (v: string) => void }) {
  return (
    <Select defaultValue="landscape" onValueChange={onValueChange}>
      <SelectTrigger aria-label="Genre" className="mine">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="sheet">
        <SelectGroup>
          <SelectLabel>Outdoor</SelectLabel>
          <SelectItem value="landscape">Landscape</SelectItem>
          <SelectItem value="street">Street</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>People</SelectLabel>
          <SelectItem value="events" disabled>Events · fully booked</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

describe('Select', () => {
  it('renders a labelled combobox trigger with the current value', () => {
    render(<SelectDemo />);
    const trigger = screen.getByRole('combobox', { name: 'Genre' });
    expect(trigger).toHaveClass('pa-trigger');
    expect(trigger).toHaveTextContent('Landscape');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens a grouped listbox and picks an option', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Genre onValueChange={onValueChange} />);
    const trigger = screen.getByRole('combobox', { name: 'Genre' });
    expect(trigger).toHaveClass('pa-trigger', 'mine');
    await user.click(trigger);
    const listbox = await screen.findByRole('listbox');
    expect(listbox.closest('.pa-pop')).toHaveClass('pa-menu', 'sheet');
    expect(within(listbox).getByRole('group', { name: 'Outdoor' })).toBeInTheDocument();
    const checked = within(listbox).getByRole('option', { name: 'Landscape' });
    expect(checked).toHaveAttribute('aria-selected', 'true');
    expect(checked).toHaveClass('pa-mi');
    expect(within(listbox).getByRole('option', { name: 'Events · fully booked' })).toHaveAttribute('aria-disabled', 'true');
    await user.click(within(listbox).getByRole('option', { name: 'Street' }));
    expect(onValueChange).toHaveBeenCalledWith('street');
    expect(trigger).toHaveTextContent('Street');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens with the keyboard', async () => {
    const user = userEvent.setup();
    render(<Genre />);
    screen.getByRole('combobox').focus();
    await user.keyboard('{Enter}');
    expect(await screen.findByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
