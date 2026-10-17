import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import ContextMenuDemo from '@/docs/demos/ContextMenu.demo';
import { endSlide, mockSlideAnimations } from './support/slide-motion';

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

describe('ContextMenu layout, highlight and motion', () => {
  afterEach(() => vi.restoreAllMocks());

  /** Items must be flex children of .pa-menu (directly or through a role="group") so its 2px gap separates them. */
  function expectItemsInGap(menu: HTMLElement) {
    expect(menu).toHaveClass('pa-menu');
    const items = [...menu.querySelectorAll('.pa-mi')];
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      const parent = item.parentElement as HTMLElement;
      const ok = parent === menu || (parent.getAttribute('role') === 'group' && parent.parentElement === menu);
      expect(ok, item.textContent ?? '').toBe(true);
    }
  }

  it('renders items as direct children (or groups) of the .pa-menu sheet', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Photo</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Set as cover</ContextMenuItem>
          <ContextMenuGroup>
            <ContextMenuItem>Copy link</ContextMenuItem>
            <ContextMenuItem>Download</ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">Remove</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText('Photo'));
    expectItemsInGap(screen.getByRole('menu'));
  });

  it('demo: the static preview and the real menu both keep items in the gap, with nothing pinned', () => {
    render(<ContextMenuDemo />);
    const preview = screen.getByTestId('context-preview');
    expectItemsInGap(preview);
    expect(preview.querySelector('.on')).toBeNull();
    fireEvent.contextMenu(screen.getByText('Right-click a photo'));
    const menu = screen.getByRole('menu');
    expectItemsInGap(menu);
    expect(menu).toHaveClass('pa-slide');
    expect(menu.querySelector('[data-highlighted]')).toBeNull();
  });

  it('moves data-highlighted to the item under the pointer', () => {
    render(<Example />);
    fireEvent.contextMenu(screen.getByText('Photo'));
    const cover = screen.getByRole('menuitem', { name: 'Set as cover' });
    const copy = screen.getByRole('menuitem', { name: 'Copy link' });
    fireEvent.pointerMove(cover, { pointerType: 'mouse' });
    expect(cover).toHaveAttribute('data-highlighted');
    fireEvent.pointerMove(copy, { pointerType: 'mouse' });
    expect(copy).toHaveAttribute('data-highlighted');
    expect(cover).not.toHaveAttribute('data-highlighted');
  });

  it('keeps the closing sheet with data-state="closed" until its slide-up ends', async () => {
    mockSlideAnimations();
    render(<Example />);
    fireEvent.contextMenu(screen.getByText('Photo'));
    const menu = screen.getByRole('menu');
    await userEvent.keyboard('{Escape}');
    expect(menu).toHaveAttribute('data-state', 'closed');
    act(() => endSlide(menu));
    expect(menu).not.toBeInTheDocument();
  });
});
