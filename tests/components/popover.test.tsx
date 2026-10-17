import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import PopoverDemo from '@/docs/demos/Popover.demo';

function Example() {
  return (
    <Popover>
      <PopoverTrigger>Share album</PopoverTrigger>
      <PopoverContent aria-label="Share album" className="custom">
        <input aria-label="Share link" defaultValue="studio.com/a/w8k2" />
        <PopoverClose>Done</PopoverClose>
      </PopoverContent>
    </Popover>
  );
}

afterEach(() => vi.restoreAllMocks());

describe('Popover', () => {
  it('toggles from the trigger and exposes dialog semantics', async () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Share album' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const pop = screen.getByRole('dialog', { name: 'Share album' });
    expect(pop).toHaveClass('pa-pop', 'pa-arrow-up', 'pa-popover', 'custom');
    expect(pop).toHaveAttribute('data-align', 'start');
    await userEvent.click(trigger);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes with Escape (focus back on the trigger) and PopoverClose', async () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Share album' });
    await userEvent.click(trigger);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('demo starts open without taking focus, survives outside clicks, toggles from its trigger', async () => {
    render(<><button type="button">Elsewhere</button><PopoverDemo /></>);
    const pop = screen.getByRole('dialog', { name: 'Share album' });
    expect(pop).not.toContainElement(document.activeElement as HTMLElement);
    await userEvent.click(screen.getByRole('button', { name: 'Elsewhere' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Share album' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('keeps closed content mounted with data-state="closed" while the exit animation runs', async () => {
    const real = window.getComputedStyle.bind(window);
    vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element, pseudo?: string | null) => {
      const style = real(el, pseudo);
      return new Proxy(style, {
        get(target, prop) {
          if (prop === 'animationName' && el instanceof HTMLElement && el.classList.contains('pa-popover')) {
            return el.dataset.state === 'closed' ? 'pa-popover-out' : 'pa-popover-in';
          }
          const value: unknown = Reflect.get(target, prop, target);
          return typeof value === 'function' ? value.bind(target) : value;
        },
      });
    });
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Share album' }));
    const pop = screen.getByRole('dialog');
    expect(pop).toHaveAttribute('data-state', 'open');
    expect(pop).toHaveAttribute('data-side', 'bottom');
    await userEvent.keyboard('{Escape}');
    expect(pop).toHaveAttribute('data-state', 'closed');
    const end = new Event('animationend');
    Object.defineProperty(end, 'animationName', { value: 'pa-popover-out' });
    act(() => {
      pop.dispatchEvent(end);
    });
    expect(pop).not.toBeInTheDocument();
  });
});
