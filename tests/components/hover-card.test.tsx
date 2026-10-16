import { describe, expect, it } from 'vitest';
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
});
