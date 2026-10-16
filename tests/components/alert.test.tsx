import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Star } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AlertDemo from '@/docs/demos/Alert.demo';

describe('Alert', () => {
  it('uses status for info/success and alert for warning/destructive', () => {
    render(<AlertDemo />);
    const statuses = screen.getAllByRole('status');
    expect(statuses).toHaveLength(2);
    expect(statuses[0]).toHaveClass('pa-alert', 'info');
    expect(statuses[1]).toHaveClass('success');
    const alerts = screen.getAllByRole('alert');
    expect(alerts).toHaveLength(2);
    expect(alerts[0]).toHaveClass('warning');
    expect(alerts[1]).toHaveClass('destructive');
    expect(alerts[1]).toHaveTextContent('Payment failed');
  });

  it('shows a default icon in a hidden disc for each tone', () => {
    render(<AlertDemo />);
    for (const el of [...screen.getAllByRole('status'), ...screen.getAllByRole('alert')]) {
      const disc = el.querySelector('.pa-alert-icon');
      expect(disc).toHaveAttribute('aria-hidden', 'true');
      expect(disc?.querySelector('svg.pa-i')).not.toBeNull();
    }
  });

  it('neutral default has no role or icon, merges className, renders title and description', () => {
    const { container } = render(
      <Alert className="mine">
        <AlertTitle>Tip</AlertTitle>
        <AlertDescription>Drag to reorder.</AlertDescription>
      </Alert>,
    );
    const el = container.firstElementChild;
    expect(el).toHaveClass('pa-alert', 'mine');
    expect(el).not.toHaveClass('info');
    expect(el).not.toHaveAttribute('role');
    expect(el?.querySelector('.pa-alert-icon')).toBeNull();
    expect(screen.getByText('Tip')).toHaveClass('pa-alert-title');
    expect(screen.getByText('Drag to reorder.')).toHaveClass('pa-alert-desc');
  });

  it('accepts a custom icon, null icon and role override', () => {
    const { rerender, container } = render(
      <Alert variant="info" icon={<Star className="pa-i sm" data-testid="star" />} role="alert">Hi</Alert>,
    );
    expect(screen.getByRole('alert')).toHaveClass('info');
    expect(screen.getByTestId('star').closest('.pa-alert-icon')).not.toBeNull();
    rerender(<Alert variant="warning" icon={null}>Hi</Alert>);
    expect(container.querySelector('.pa-alert-icon')).toBeNull();
  });
});
