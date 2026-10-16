import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import DrawerDemo from '@/docs/demos/Drawer.demo';

function Example() {
  return (
    <Drawer>
      <DrawerTrigger>Order a print</DrawerTrigger>
      <DrawerContent className="custom">
        <DrawerHeader>
          <DrawerTitle>Order a print</DrawerTitle>
          <DrawerDescription>Archival cotton paper.</DrawerDescription>
        </DrawerHeader>
        <DrawerClose>Cancel</DrawerClose>
      </DrawerContent>
    </Drawer>
  );
}

// vaul reads the computed transform on pointer release; jsdom returns an empty string.
const realGetComputedStyle = window.getComputedStyle.bind(window);
beforeAll(() => {
  vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element, pseudo?: string | null) => {
    const style = realGetComputedStyle(el, pseudo);
    if (!style.transform) Object.defineProperty(style, 'transform', { value: 'none' });
    return style;
  });
});
afterAll(() => vi.restoreAllMocks());
// vaul captures the pointer when a drag starts.
Element.prototype.setPointerCapture ??= () => {};

describe('Drawer', () => {
  it('opens a dialog with a handle, title, description and merged classes', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Order a print' }));
    const drawer = await screen.findByRole('dialog', { name: 'Order a print' });
    expect(drawer).toHaveAccessibleDescription('Archival cotton paper.');
    expect(drawer).toHaveClass('pa-pop', 'pa-drawer', 'pa-fixed', 'custom');
    expect(drawer.querySelector('.pa-drawer-handle')).toHaveAttribute('aria-hidden', 'true');
  });

  it('closes with Escape and with DrawerClose', async () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Order a print' });
    await userEvent.click(trigger);
    await screen.findByRole('dialog');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Order a print' })).toHaveAttribute('aria-expanded', 'false'));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), { timeout: 2000 });
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
  });

  it('demo shows a static preview, opens the real drawer in its stage, and the size choice updates the price', async () => {
    render(<DrawerDemo />);
    // The preview is hidden from assistive tech and nothing on the page is modal yet.
    expect(screen.getByTestId('drawer-preview')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Order a print' }));
    const drawer = await screen.findByRole('dialog', { name: 'Order a print' });
    expect(screen.queryByTestId('drawer-preview')).not.toBeInTheDocument();
    expect(drawer.closest('.pa-stage')).not.toBeNull();
    expect(drawer).toHaveAttribute('data-vaul-custom-container', 'true');
    expect(screen.getByRole('button', { name: 'Add to cart · $95' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('radio', { name: 'A4 · $60' }));
    expect(screen.getByRole('button', { name: 'Add to cart · $60' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Order a print' })).toHaveAttribute('aria-expanded', 'false'));
  });
});
