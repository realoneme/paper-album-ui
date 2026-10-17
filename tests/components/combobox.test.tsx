import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { endSlide, mockSlideAnimations } from './support/slide-motion';
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
    // The chosen value carries data-checked (its check mark), never a pinned highlight class.
    const kyoto = within(list).getByRole('option', { name: /Kyoto/ });
    expect(kyoto).toHaveClass('pa-mi');
    expect(kyoto).not.toHaveClass('on');
    expect(kyoto).toHaveAttribute('data-checked', 'true');
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

describe('Combobox highlight and motion', () => {
  afterEach(() => vi.restoreAllMocks());

  it('the highlight follows the pointer; the chosen value keeps only its check', () => {
    render(<Combobox label="Location" options={places} defaultValue="kyoto" defaultOpen />);
    const kyoto = screen.getByRole('option', { name: /Kyoto/ });
    const skye = screen.getByRole('option', { name: /Isle of Skye/ });
    fireEvent.pointerMove(skye);
    expect(skye).toHaveAttribute('data-selected', 'true');
    expect(kyoto).toHaveAttribute('data-selected', 'false');
    expect(kyoto).toHaveAttribute('data-checked', 'true');
    expect(kyoto).not.toHaveClass('on');
  });

  it('slides the list up on close: data-state="closed" until the animation ends', async () => {
    mockSlideAnimations();
    const user = userEvent.setup();
    render(<Combobox label="Location" options={places} />);
    await user.click(screen.getByRole('combobox'));
    const sheet = screen.getByRole('listbox').closest('.pa-pop') as HTMLElement;
    expect(sheet).toHaveClass('pa-slide');
    expect(sheet).toHaveAttribute('data-state', 'open');
    await user.keyboard('{Escape}');
    expect(sheet).toHaveAttribute('data-state', 'closed');
    act(() => endSlide(sheet));
    expect(sheet).not.toBeInTheDocument();
  });
});
