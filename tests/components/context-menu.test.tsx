import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import ContextMenuDemo from '@/docs/demos/ContextMenu.demo';

function Example({ onCover = () => {} }: { onCover?: () => void }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>Photo</ContextMenuTrigger>
      <ContextMenuContent className="custom">
        <ContextMenuLabel>Photo</ContextMenuLabel>
        <ContextMenuItem onSelect={onCover}>Set as cover</ContextMenuItem>
        <ContextMenuItem>Copy link</ContextMenuItem>
        <ContextMenuCheckboxItem checked>Featured</ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Remove</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

describe('ContextMenu', () => {
  it('opens on right-click with paper classes', async () => {
    render(<Example />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await userEvent.pointer({ keys: '[MouseRight]', target: screen.getByText('Photo') });
    const menu = screen.getByRole('menu');
    expect(menu).toHaveClass('pa-pop', 'pa-menu', 'custom');
    expect(screen.getByRole('menuitem', { name: 'Remove' })).toHaveClass('pa-mi', 'danger');
    expect(screen.getByRole('menuitemcheckbox', { name: 'Featured' })).toHaveAttribute('aria-checked', 'true');
  });

  it('moves with the arrow keys, selects with Enter and closes', async () => {
    const onCover = vi.fn();
    render(<Example onCover={onCover} />);
    fireEvent.contextMenu(screen.getByText('Photo'), { clientX: 10, clientY: 10 });
    expect(screen.getByRole('menu')).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Set as cover' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Copy link' })).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}{Enter}');
    expect(onCover).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes with Escape', async () => {
    render(<Example />);
    fireEvent.contextMenu(screen.getByText('Photo'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('demo shows a static preview until the real menu opens inside its stage', () => {
    const { container } = render(<ContextMenuDemo />);
    expect(screen.getByTestId('context-preview')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    fireEvent.contextMenu(screen.getByText('Right-click a photo'));
    expect(screen.queryByTestId('context-preview')).not.toBeInTheDocument();
    expect(container).toContainElement(screen.getByRole('menu'));
    expect(screen.getAllByRole('menuitem').map((i) => i.textContent)).toEqual(['Set as cover', 'Move to…', 'Copy link', 'Remove']);
  });
});
