import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import HoverCardDemo from '@/docs/demos/HoverCard.demo';

function Example() {
  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger href="#mira">@mira.k</HoverCardTrigger>
      <HoverCardContent className="custom">
        <b>Mira K.</b>
      </HoverCardContent>
    </HoverCard>
  );
}

afterEach(() => vi.restoreAllMocks());

describe('HoverCard', () => {
  it('opens on hover with merged classes and closes when the pointer leaves', async () => {
    render(<Example />);
    const link = screen.getByRole('link', { name: '@mira.k' });
    expect(screen.queryByText('Mira K.')).not.toBeInTheDocument();
    await userEvent.hover(link);
    const card = await screen.findByText('Mira K.');
    expect(card.parentElement).toHaveClass('pa-pop', 'pa-hovercard', 'custom');
    expect(link).toHaveAttribute('data-state', 'open');
    await userEvent.unhover(link);
    await waitFor(() => expect(screen.queryByText('Mira K.')).not.toBeInTheDocument());
  });

  it('opens on keyboard focus and closes with Escape', async () => {
    render(<Example />);
    await userEvent.tab();
    expect(screen.getByRole('link')).toHaveFocus();
    expect(await screen.findByText('Mira K.')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByText('Mira K.')).not.toBeInTheDocument());
  });

  it('demo starts open inside its stage', () => {
    const { container } = render(<HoverCardDemo />);
    const card = screen.getByText('Mira K.').closest('.pa-hovercard');
    expect(card).not.toBeNull();
    expect(container).toContainElement(card as HTMLElement);
  });

  it('opens immediately on hover by default (openDelay 0)', async () => {
    render(
      <HoverCard>
        <HoverCardTrigger href="#mira">@mira.k</HoverCardTrigger>
        <HoverCardContent>
          <b>Mira K.</b>
        </HoverCardContent>
      </HoverCard>,
    );
    await userEvent.hover(screen.getByRole('link', { name: '@mira.k' }));
    expect(await screen.findByText('Mira K.', {}, { timeout: 50 })).toBeInTheDocument();
  });

  it('hangs the card from the pointer: alignOffset follows the pointer x on the trigger', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      const r = this.tagName === 'A' ? { left: 100, top: 10, width: 80, height: 20 } : { left: 0, top: 0, width: 0, height: 0 };
      return { ...r, right: r.left + r.width, bottom: r.top + r.height, x: r.left, y: r.top, toJSON: () => ({}) } as DOMRect;
    });
    render(<Example />);
    const link = screen.getByRole('link', { name: '@mira.k' });
    await userEvent.pointer({ target: link, coords: { clientX: 160, clientY: 20 } });
    const card = (await screen.findByText('Mira K.')).parentElement as HTMLElement;
    // Pointer 60px into the trigger, minus half the 248px card: the thread hangs from the pointer.
    expect(card).toHaveAttribute('data-align-offset', '-64');
    expect(card).toHaveAttribute('data-align', 'start');
    expect(card.style.getPropertyValue('--thread')).toBe('18px');
    await userEvent.unhover(link);
    await waitFor(() => expect(screen.queryByText('Mira K.')).not.toBeInTheDocument());
    await userEvent.pointer({ target: link, coords: { clientX: 110, clientY: 20 } });
    expect((await screen.findByText('Mira K.')).parentElement).toHaveAttribute('data-align-offset', '-114');
  });
});
