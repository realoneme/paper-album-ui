import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import TooltipDemo from '@/docs/demos/Tooltip.demo';

function Example() {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger aria-label="Download">D</TooltipTrigger>
      <TooltipContent className="custom">Download original</TooltipContent>
    </Tooltip>
  );
}

describe('Tooltip', () => {
  it('shows a tooltip on hover, described by the trigger, with merged classes; hides on press', async () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Download' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    await userEvent.hover(trigger);
    const tip = await screen.findByRole('tooltip');
    expect(tip).toHaveTextContent('Download original');
    expect(trigger).toHaveAccessibleDescription('Download original');
    expect(document.querySelector('.pa-tooltip')).toHaveClass('custom');
    // Pressing the trigger dismisses the label.
    await userEvent.pointer({ keys: '[MouseLeft]', target: trigger });
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('shows on keyboard focus and closes with Escape', async () => {
    render(<Example />);
    await userEvent.tab();
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('demo starts with "Download original" open, then releases it on interaction', async () => {
    render(<TooltipDemo />);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Download original');
    expect(screen.getByRole('button', { name: 'Download' })).toHaveAccessibleDescription('Download original');
    await userEvent.hover(screen.getByRole('button', { name: 'Favorite' }));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Add to favorites');
  });
});
