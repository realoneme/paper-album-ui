import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar';
import MenubarDemo from '@/docs/demos/Menubar.demo';

function Example({ onNew = () => {} }: { onNew?: () => void }) {
  return (
    <Menubar aria-label="Editor" className="custom">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onSelect={onNew}>New album</MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Export as</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>JPEG · web</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem disabled>Publish changes</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

describe('Menubar', () => {
  it('renders a labelled menubar with merged classes and opens a menu on click', async () => {
    render(<Example />);
    const bar = screen.getByRole('menubar', { name: 'Editor' });
    expect(bar).toHaveClass('pa-menubar', 'custom');
    const file = screen.getByRole('menuitem', { name: 'File' });
    await userEvent.click(file);
    expect(file).toHaveAttribute('aria-expanded', 'true');
    const menu = screen.getByRole('menu', { name: 'File' });
    expect(menu).toHaveClass('pa-pop', 'pa-menu');
    expect(screen.getByRole('menuitem', { name: 'Publish changes' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('moves between menus with the arrow keys and opens a submenu', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('menu', { name: 'Edit' })).toBeInTheDocument();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('menu', { name: 'File' })).toBeInTheDocument();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'New album' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{ArrowRight}');
    expect(await screen.findByRole('menuitem', { name: 'JPEG · web' })).toBeInTheDocument();
  });

  it('selects with Enter and closes with Escape', async () => {
    const onNew = vi.fn();
    render(<Example onNew={onNew} />);
    const file = screen.getByRole('menuitem', { name: 'File' });
    await userEvent.click(file);
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(onNew).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await userEvent.click(file);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('demo starts with File and its Export submenu open, without taking focus', async () => {
    render(<MenubarDemo />);
    const file = screen.getByRole('menu', { name: 'File' });
    expect(file).not.toContainElement(document.activeElement as HTMLElement);
    expect(screen.getByRole('menuitem', { name: 'TIFF · print' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
    expect(screen.queryByRole('menu', { name: 'File' })).not.toBeInTheDocument();
  });
});
