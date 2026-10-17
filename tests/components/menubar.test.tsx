import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
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
import { endSlide, mockSlideAnimations } from './support/slide-motion';

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

  it('demo starts with File and, on a wide screen, its Export submenu open, without taking focus', async () => {
    const wide = vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({ matches: true, media: query, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false }));
    render(<MenubarDemo />);
    wide.mockRestore();
    const file = screen.getByRole('menu', { name: 'File' });
    expect(file).not.toContainElement(document.activeElement as HTMLElement);
    expect(screen.getByRole('menuitem', { name: 'TIFF · print' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
    expect(screen.queryByRole('menu', { name: 'File' })).not.toBeInTheDocument();
  });

  it('demo opens only the File menu on a narrow screen', () => {
    render(<MenubarDemo />);
    expect(screen.getByRole('menu', { name: 'File' })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'TIFF · print' })).not.toBeInTheDocument();
  });

  it('demo opens the Export submenu only on load: reopening File shows just the menu', async () => {
    render(<MenubarDemo />);
    await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
    expect(screen.queryByRole('menu', { name: 'File' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
    expect(await screen.findByRole('menu', { name: 'File' })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'TIFF · print' })).not.toBeInTheDocument();
  });
});

/** Lays the bar out like a browser would: the bar at (100, 50), triggers 4px in, each 50px wide plus a 2px gap. */
function mockMenubarRects() {
  const rect = (left: number, top: number, width: number, height: number) =>
    ({ left, top, width, height, x: left, y: top, right: left + width, bottom: top + height, toJSON: () => ({}) }) as DOMRect;
  return vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    if (this.classList.contains('pa-menubar')) return rect(100, 50, 300, 48);
    if (this.classList.contains('pa-menubar-trigger')) {
      const index = [...this.parentElement!.querySelectorAll('.pa-menubar-trigger')].indexOf(this);
      return rect(104 + index * 52, 54, 50, 40);
    }
    return rect(0, 0, 0, 0);
  });
}

describe('Menubar slip and motion', () => {
  afterEach(() => vi.restoreAllMocks());

  it('slides a paper slip to the open trigger and follows the arrow keys and hover', async () => {
    mockMenubarRects();
    render(<Example />);
    const slip = document.querySelector('.pa-menubar-slip') as HTMLElement;
    expect(slip).toHaveAttribute('aria-hidden', 'true');
    expect(slip).toHaveAttribute('data-state', 'closed');

    await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
    expect(slip).toHaveAttribute('data-state', 'open');
    expect(slip.style.transform).toBe('translate(4px, 4px)');
    expect(slip.style.width).toBe('50px');
    expect(slip.style.height).toBe('40px');
    // First appearance jumps into place instead of travelling.
    expect(slip).toHaveAttribute('data-instant');

    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('menu', { name: 'Edit' })).toBeInTheDocument();
    expect(slip.style.transform).toBe('translate(56px, 4px)');
    expect(slip).not.toHaveAttribute('data-instant');

    // Hover switches menus at once while one is open.
    await userEvent.hover(screen.getByRole('menuitem', { name: 'File' }));
    expect(screen.getByRole('menu', { name: 'File' })).toBeInTheDocument();
    expect(slip.style.transform).toBe('translate(4px, 4px)');

    await userEvent.keyboard('{Escape}');
    expect(slip).toHaveAttribute('data-state', 'closed');
  });

  it('keeps the slip in step with a controlled value', () => {
    mockMenubarRects();
    const Bar = ({ value }: { value: string }) => (
      <Menubar aria-label="Editor" value={value}>
        <MenubarMenu value="file">
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent><MenubarItem>New album</MenubarItem></MenubarContent>
        </MenubarMenu>
        <MenubarMenu value="edit">
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent><MenubarItem>Undo</MenubarItem></MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    const { rerender } = render(<Bar value="edit" />);
    const slip = document.querySelector('.pa-menubar-slip') as HTMLElement;
    expect(slip).toHaveAttribute('data-state', 'open');
    expect(slip.style.transform).toBe('translate(56px, 4px)');
    rerender(<Bar value="" />);
    expect(slip).toHaveAttribute('data-state', 'closed');
    rerender(<Bar value="file" />);
    expect(slip.style.transform).toBe('translate(4px, 4px)');
    expect(slip).toHaveAttribute('data-instant');
  });

  it('swaps sheets at once between menus and slides the last one up on close', async () => {
    mockSlideAnimations();
    render(<Example />);
    await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
    const file = screen.getByRole('menu', { name: 'File' });
    expect(file).toHaveClass('pa-slide');
    await userEvent.keyboard('{ArrowRight}');
    // The File sheet goes at once, so it cannot treat focus entering Edit as an outside interaction.
    expect(file).not.toBeInTheDocument();
    const edit = screen.getByRole('menu', { name: 'Edit' });
    await userEvent.keyboard('{Escape}');
    expect(edit).toHaveAttribute('data-state', 'closed');
    act(() => endSlide(edit));
    expect(edit).not.toBeInTheDocument();
  });

  it('highlights the item under the pointer and opens a submenu on hover without delay', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
    const fresh = screen.getByRole('menuitem', { name: 'New album' });
    fireEvent.pointerMove(fresh, { pointerType: 'mouse' });
    expect(fresh).toHaveAttribute('data-highlighted');
    const sub = screen.getByRole('menuitem', { name: 'Export as' });
    await act(async () => {
      fireEvent.pointerMove(sub, { pointerType: 'mouse' });
      await Promise.resolve();
    });
    expect(sub).toHaveAttribute('data-highlighted');
    expect(fresh).not.toHaveAttribute('data-highlighted');
    expect(screen.getByRole('menuitem', { name: 'JPEG · web' })).toBeInTheDocument();
  });
});
