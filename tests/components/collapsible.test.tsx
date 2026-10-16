import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

describe('Collapsible', () => {
  it('toggles the body and aria-expanded', async () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Collapsible className="extra" onOpenChange={onOpenChange}>
        <CollapsibleTrigger icon={<svg data-testid="icon" />}>Camera settings</CollapsibleTrigger>
        <CollapsibleContent><div className="cell">ISO 200</div></CollapsibleContent>
      </Collapsible>,
    );
    expect(container.firstChild).toHaveClass('pa-collapsible', 'extra');
    const trigger = screen.getByRole('button', { name: 'Camera settings' });
    expect(trigger).toHaveClass('pa-acc-trigger');
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('ISO 200')).not.toBeInTheDocument();

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    const body = screen.getByText('ISO 200').parentElement;
    expect(body).toHaveClass('body');
    expect(trigger).toHaveAttribute('aria-controls', body?.id);

    await userEvent.keyboard('{Enter}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('starts open with defaultOpen and supports asChild triggers', () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger asChild><button type="button" className="custom">More</button></CollapsibleTrigger>
        <CollapsibleContent>Details</CollapsibleContent>
      </Collapsible>,
    );
    const trigger = screen.getByRole('button', { name: 'More' });
    expect(trigger).toHaveClass('custom');
    expect(trigger).not.toHaveClass('pa-acc-trigger');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Details')).toBeVisible();
  });
});
