import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DropdownMenuDemo from '@/docs/demos/DropdownMenu.demo';
import { endSlide, mockSlideAnimations, readCss, slideCss } from './support/slide-motion';

function Example({ onProfile = () => {} }: { onProfile?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Account</DropdownMenuTrigger>
      <DropdownMenuContent className="custom">
        <DropdownMenuLabel>My studio</DropdownMenuLabel>
        <DropdownMenuItem onSelect={onProfile}>Profile</DropdownMenuItem>
        <DropdownMenuItem disabled>Billing</DropdownMenuItem>
        <DropdownMenuCheckboxItem checked>Show watermark</DropdownMenuCheckboxItem>
        <DropdownMenuRadioGroup value="grid">
          <DropdownMenuRadioItem value="grid">Grid</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="list">List</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Export as</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>JPEG</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe('DropdownMenu', () => {
  it('opens a menu from the trigger with paper classes', async () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Account' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    await userEvent.click(trigger);
    const menu = screen.getByRole('menu', { name: 'Account' });
    expect(menu).toHaveClass('pa-pop', 'pa-menu', 'custom');
    expect(screen.getByText('My studio')).toHaveClass('pa-grp');
    expect(screen.getByRole('menuitem', { name: 'Profile' })).toHaveClass('pa-mi');
    expect(screen.getByRole('menuitem', { name: 'Billing' })).toHaveAttribute('data-disabled');
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toHaveClass('pa-mi', 'danger');
    expect(screen.getByRole('menuitemcheckbox', { name: 'Show watermark' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('menuitemradio', { name: 'Grid' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('separator')).toHaveClass('pa-sep');
  });

  it('navigates with the keyboard, skips disabled items and selects with Enter', async () => {
    const onProfile = vi.fn();
    render(<Example onProfile={onProfile} />);
    screen.getByRole('button', { name: 'Account' }).focus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('menuitem', { name: 'Profile' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitemcheckbox', { name: 'Show watermark' })).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}{Enter}');
    expect(onProfile).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens a submenu with the right arrow and closes everything with Escape', async () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Account' });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    const sub = screen.getByRole('menuitem', { name: 'Export as' });
    sub.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(await screen.findByRole('menuitem', { name: 'JPEG' })).toBeInTheDocument();
    expect(sub).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.queryByRole('menuitem', { name: 'JPEG' })).not.toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('demo starts open without taking focus and toggles checkable items in place', async () => {
    render(<DropdownMenuDemo />);
    const menu = screen.getByRole('menu', { name: '[Studio Name]' });
    expect(menu).not.toContainElement(document.activeElement as HTMLElement);
    const downloads = screen.getByRole('menuitemcheckbox', { name: 'Allow downloads' });
    expect(downloads).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(downloads);
    expect(screen.getByRole('menuitemcheckbox', { name: 'Allow downloads' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(screen.getByRole('button', { name: /Studio Name/ }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

describe('DropdownMenu highlight and motion', () => {
  afterEach(() => vi.restoreAllMocks());

  it('moves data-highlighted to the item under the pointer, one item at a time', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Account' }));
    const profile = screen.getByRole('menuitem', { name: 'Profile' });
    const watermark = screen.getByRole('menuitemcheckbox', { name: 'Show watermark' });
    fireEvent.pointerMove(profile, { pointerType: 'mouse' });
    expect(profile).toHaveAttribute('data-highlighted');
    fireEvent.pointerMove(watermark, { pointerType: 'mouse' });
    expect(watermark).toHaveAttribute('data-highlighted');
    expect(profile).not.toHaveAttribute('data-highlighted');
    expect(document.querySelectorAll('[data-highlighted]')).toHaveLength(1);
    // A disabled item never takes the highlight; the pointer on it clears the old one.
    fireEvent.pointerMove(screen.getByRole('menuitem', { name: 'Billing' }), { pointerType: 'mouse' });
    expect(document.querySelectorAll('[data-highlighted]')).toHaveLength(0);
  });

  it('paints the highlight from [data-highlighted] only, never from :hover', () => {
    const css = readCss('dropdown-menu');
    expect(css).toMatch(/\[role\^="menuitem"\]\.pa-mi:hover \{ background: transparent; \}/);
    expect(css).toMatch(/\[role\^="menuitem"\]\.pa-mi\[data-highlighted\],[^{]*\{ background: var\(--accent\)/);
    // The disabled look is scoped to Radix items, so cmdk's data-disabled="false" never matches it.
    expect(css).not.toMatch(/^\.pa-mi\[data-disabled\]/m);
  });

  it('opens a submenu as soon as the pointer rests on its trigger', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Account' }));
    const sub = screen.getByRole('menuitem', { name: 'Export as' });
    await act(async () => {
      fireEvent.pointerMove(sub, { pointerType: 'mouse' });
      await Promise.resolve();
    });
    // Radix alone would wait 100ms; this runs well inside that.
    expect(sub).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menuitem', { name: 'JPEG' })).toBeInTheDocument();
  });

  it('slides the sheet up on close: data-state="closed" until the animation ends', async () => {
    mockSlideAnimations();
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Account' }));
    const menu = screen.getByRole('menu');
    expect(menu).toHaveClass('pa-slide');
    expect(menu).toHaveAttribute('data-state', 'open');
    await userEvent.keyboard('{Escape}');
    expect(menu).toBeInTheDocument();
    expect(menu).toHaveAttribute('data-state', 'closed');
    act(() => endSlide(menu));
    expect(menu).not.toBeInTheDocument();
  });

  it('slide-down motion follows data-side and falls back to a fade for reduced motion', () => {
    expect(slideCss).toMatch(/\.pa-slide\[data-side="top"\]/);
    expect(slideCss).toMatch(/\.pa-slide\[data-state="closed"\] \{ animation: pa-slide-out/);
    expect(slideCss).toMatch(/prefers-reduced-motion: reduce[\s\S]*pa-slide-fade-in/);
    expect(readCss('dropdown-menu')).toContain('--radix-dropdown-menu-content-transform-origin');
  });
});
