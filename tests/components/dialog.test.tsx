import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import DialogDemo from '@/docs/demos/Dialog.demo';

function Example({ container }: { container?: HTMLElement | null }) {
  return (
    <Dialog>
      <DialogTrigger>Edit album</DialogTrigger>
      <DialogContent className="custom" container={container}>
        <DialogHeader>
          <DialogTitle>Edit album</DialogTitle>
          <DialogDescription>Changes show right away.</DialogDescription>
        </DialogHeader>
        <input aria-label="Title" />
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const rect = (left: number, top: number, width: number, height: number) =>
  ({ left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => ({}) }) as DOMRect;

/** Trigger at (20,20) 100×40 with an 8px radius; the open dialog rests at (300,200) 400×300. */
function mockRects() {
  return vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    if (this.getAttribute('role') === 'dialog') return rect(300, 200, 400, 300);
    if (this.tagName === 'BUTTON' && this.textContent === 'Edit album') return rect(20, 20, 100, 40);
    return rect(0, 0, 0, 0);
  });
}

/** Pretend the stylesheet is loaded: closed content reports an exit animation, so Radix Presence waits for it. */
function mockAnimations() {
  const real = window.getComputedStyle.bind(window);
  return vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element, pseudo?: string | null) => {
    const style = real(el, pseudo);
    return new Proxy(style, {
      get(target, prop) {
        if (prop === 'animationName' && el instanceof HTMLElement && el.classList.contains('pa-grow')) {
          return el.dataset.state === 'closed' ? 'pa-dlg-grow-out' : 'pa-dlg-grow-in';
        }
        const value: unknown = Reflect.get(target, prop, target);
        return typeof value === 'function' ? value.bind(target) : value;
      },
    });
  });
}

afterEach(() => vi.restoreAllMocks());

describe('Dialog', () => {
  it('opens from the trigger with title, description and merged classes', async () => {
    render(<Example />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Edit album' }));
    const dialog = screen.getByRole('dialog', { name: 'Edit album' });
    expect(dialog).toHaveAccessibleDescription('Changes show right away.');
    expect(dialog).toHaveClass('pa-pop', 'pa-dialog', 'pa-fixed', 'custom');
    expect(screen.getByText('Edit album', { selector: 'h2' })).toHaveClass('pa-dialog-title');
    expect(document.querySelector('.pa-backdrop')).toBeInTheDocument();
  });

  it('closes with Escape and returns focus to the trigger', async () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Edit album' });
    await userEvent.click(trigger);
    expect(screen.getByRole('dialog')).toContainElement(document.activeElement as HTMLElement);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes from the labelled close button and from DialogClose', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Edit album' }));
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Edit album' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('portals into a container without the fixed modifier', async () => {
    const stage = document.createElement('div');
    document.body.appendChild(stage);
    render(<Example container={stage} />);
    await userEvent.click(screen.getByRole('button', { name: 'Edit album' }));
    const dialog = screen.getByRole('dialog');
    expect(stage).toContainElement(dialog);
    expect(dialog).not.toHaveClass('pa-fixed');
    stage.remove();
  });

  it('demo starts open inside its stage without taking focus, and can be closed and reopened', async () => {
    render(<DialogDemo />);
    const dialog = screen.getByRole('dialog', { name: 'Edit album' });
    expect(dialog.closest('.pa-stage')).not.toBeNull();
    expect(dialog).not.toContainElement(document.activeElement as HTMLElement);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Edit album' }));
    expect(screen.getByRole('dialog')).toContainElement(document.activeElement as HTMLElement);
  });

  it('grows out of the trigger: FLIP custom properties come from the trigger rect', async () => {
    mockRects();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Edit album' });
    trigger.style.borderRadius = '8px';
    await userEvent.click(trigger);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('pa-grow');
    expect(dialog).toHaveAttribute('data-state', 'open');
    expect(dialog).toHaveAttribute('data-from', 'trigger');
    // Centre (70,40) minus centre (500,350); 100/400 and 40/300 scale; 8px radius pre-divided by the scale.
    expect(dialog.style.getPropertyValue('--from-x')).toBe('-430px');
    expect(dialog.style.getPropertyValue('--from-y')).toBe('-310px');
    expect(dialog.style.getPropertyValue('--from-sx')).toBe('0.25');
    expect(dialog.style.getPropertyValue('--from-sy')).toBe('0.133');
    expect(dialog.style.getPropertyValue('--from-radius')).toBe('32px / 60px');
  });

  it('falls back to a centre scale when no trigger is known', () => {
    mockRects();
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Edit album</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).not.toHaveAttribute('data-from');
    expect(dialog.style.getPropertyValue('--from-x')).toBe('');
  });

  it('closing marks the content data-state="closed" and shrinks it back toward the trigger', async () => {
    mockRects();
    mockAnimations();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Edit album' });
    await userEvent.click(trigger);
    const dialog = screen.getByRole('dialog');
    expect(document.querySelector('.pa-backdrop')).toHaveClass('pa-fade');
    await userEvent.keyboard('{Escape}');
    // Presence keeps it mounted for the exit keyframe.
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('data-state', 'closed');
    expect(dialog).toHaveAttribute('data-from', 'trigger');
    expect(dialog.style.getPropertyValue('--from-x')).toBe('-430px');
    const end = new Event('animationend');
    Object.defineProperty(end, 'animationName', { value: 'pa-dlg-grow-out' });
    act(() => {
      dialog.dispatchEvent(end);
    });
    expect(dialog).not.toBeInTheDocument();
  });
});
