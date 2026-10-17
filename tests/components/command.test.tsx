import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { readCss } from './support/slide-motion';
import userEvent from '@testing-library/user-event';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import CommandDemo from '@/docs/demos/Command.demo';

function Example({ onNew = () => {} }: { onNew?: () => void }) {
  return (
    <Command label="Command menu" className="custom">
      <CommandInput placeholder="Search" />
      <CommandList>
        <CommandEmpty>Nothing found.</CommandEmpty>
        <CommandGroup heading="Albums">
          <CommandItem>Winter in Hokkaido</CommandItem>
          <CommandItem>Lisbon Mornings</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={onNew}>New album</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

describe('Command', () => {
  it('renders a combobox over a listbox of options with paper classes', () => {
    const { container } = render(<Example />);
    expect(container.firstElementChild).toHaveClass('pa-pop', 'pa-cmd', 'custom');
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('listbox')).toHaveClass('pa-menu');
    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(screen.getByRole('option', { name: 'Winter in Hokkaido' })).toHaveClass('pa-mi');
    expect(screen.getByText('Albums')).toHaveClass('pa-grp');
    expect(screen.getByRole('option', { name: 'Winter in Hokkaido' })).toHaveAttribute('aria-selected', 'true');
  });

  it('filters options as you type and shows the empty state', async () => {
    render(<Example />);
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'lisbon');
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Lisbon Mornings']);
    await userEvent.clear(input);
    await userEvent.type(input, 'zzz');
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByText('Nothing found.')).toHaveClass('pa-cmd-empty');
  });

  it('moves the selection with arrow keys and runs onSelect with Enter', async () => {
    const onNew = vi.fn();
    render(<Example onNew={onNew} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Lisbon Mornings' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(onNew).toHaveBeenCalledTimes(1);
  });

  it('CommandDialog opens as a titled dialog and closes with Escape', async () => {
    const onOpenChange = vi.fn();
    render(
      <CommandDialog open onOpenChange={onOpenChange}>
        <CommandInput />
        <CommandList><CommandItem>New album</CommandItem></CommandList>
      </CommandDialog>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Command menu' });
    expect(within(dialog).getByRole('combobox')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('demo lists albums and actions without glyph shortcuts', () => {
    render(<CommandDemo />);
    expect(screen.getByRole('combobox', { name: 'Command menu' })).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(4);
    expect(document.body.textContent).not.toMatch(/[⌘⇧]/);
  });
});

/** Selectors of every rule in a stylesheet, with pseudo-classes such as :hover dropped (jsdom cannot match them). */
function ruleSelectors(css: string) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('}')
    .map((chunk) => chunk.split('{')[0].trim())
    .filter((sel) => sel && !sel.startsWith('@'))
    .flatMap((sel) => sel.split(','))
    .map((sel) => sel.replace(/:hover|:focus-visible|::after/g, '').trim());
}

describe('Command highlight', () => {
  it('moves data-selected to the item under the pointer', () => {
    render(<Example />);
    const winter = screen.getByRole('option', { name: 'Winter in Hokkaido' });
    const lisbon = screen.getByRole('option', { name: 'Lisbon Mornings' });
    expect(winter).toHaveAttribute('data-selected', 'true');
    fireEvent.pointerMove(lisbon);
    expect(lisbon).toHaveAttribute('data-selected', 'true');
    expect(winter).toHaveAttribute('data-selected', 'false');
    expect(document.querySelectorAll('[data-selected="true"]')).toHaveLength(1);
  });

  it('no disabled-item rule matches an enabled cmdk item (cmdk writes data-disabled="false")', () => {
    render(<Example />);
    const item = screen.getByRole('option', { name: 'Lisbon Mornings' });
    expect(item).toHaveAttribute('data-disabled', 'false');
    for (const name of ['dropdown-menu', 'command', 'combobox', 'select']) {
      const offenders = ruleSelectors(readCss(name)).filter((sel) => sel.includes('data-disabled') && item.matches(sel));
      expect(offenders, name).toEqual([]);
    }
    expect(readCss('command')).toMatch(/\.pa-cmd-list \.pa-mi:hover \{ background: transparent; \}/);
  });
});
