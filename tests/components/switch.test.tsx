import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

describe('Switch', () => {
  it('renders a labelled switch with merged classes', () => {
    render(
      <>
        <Switch id="captions" className="extra" defaultChecked />
        <Label htmlFor="captions">Show captions</Label>
      </>,
    );
    const sw = screen.getByRole('switch', { name: 'Show captions' });
    expect(sw).toHaveClass('pa-switch', 'extra');
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles with click, label click and Space', async () => {
    const onCheckedChange = vi.fn();
    render(
      <>
        <Switch id="downloads" onCheckedChange={onCheckedChange} />
        <Label htmlFor="downloads">Allow downloads</Label>
      </>,
    );
    const sw = screen.getByRole('switch', { name: 'Allow downloads' });
    await userEvent.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    await userEvent.click(screen.getByText('Allow downloads'));
    expect(sw).toHaveAttribute('aria-checked', 'false');
    sw.focus();
    await userEvent.keyboard(' ');
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('ignores clicks when disabled', async () => {
    render(<Switch aria-label="Show captions" disabled />);
    const sw = screen.getByRole('switch', { name: 'Show captions' });
    expect(sw).toBeDisabled();
    await userEvent.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'false');
  });
});

describe('Switch sizes', () => {
  it('adds the size class for sm and lg, none for default', () => {
    render(
      <>
        <Switch aria-label="Small" size="sm" />
        <Switch aria-label="Default" />
        <Switch aria-label="Large" size="lg" />
      </>,
    );
    expect(screen.getByRole('switch', { name: 'Small' })).toHaveClass('pa-switch', 'sm');
    expect(screen.getByRole('switch', { name: 'Default' }).className).toBe('pa-switch');
    expect(screen.getByRole('switch', { name: 'Large' })).toHaveClass('pa-switch', 'lg');
  });
});
