import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
