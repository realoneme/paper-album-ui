import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HelpTip } from '@/components/ui/help-tip';

function Example() {
  return (
    <div>
      <span>Show watermark</span>
      <HelpTip label="About watermarks"><p>Printed faintly in the corner.</p></HelpTip>
      <button type="button">Elsewhere</button>
    </div>
  );
}

describe('HelpTip', () => {
  it('is a labelled "?" button, closed by default', () => {
    render(<Example />);
    const key = screen.getByRole('button', { name: 'About watermarks' });
    expect(key).toHaveClass('pa-helptip');
    expect(key).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Printed faintly in the corner.')).not.toBeInTheDocument();
  });

  it('a tap or click toggles the help and keeps focus on the key', async () => {
    render(<Example />);
    const key = screen.getByRole('button', { name: 'About watermarks' });
    await userEvent.click(key);
    const bubble = await screen.findByRole('dialog', { name: 'About watermarks' });
    expect(bubble).toHaveTextContent('Printed faintly in the corner.');
    expect(document.activeElement).toBe(key);
    await userEvent.click(key);
    await waitFor(() => expect(key).toHaveAttribute('aria-expanded', 'false'));
  });

  it('opens from the keyboard and closes with Escape', async () => {
    render(<Example />);
    const key = screen.getByRole('button', { name: 'About watermarks' });
    key.focus();
    await userEvent.keyboard('{Enter}');
    expect(await screen.findByRole('dialog', { name: 'About watermarks' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(key).toHaveAttribute('aria-expanded', 'false'));
  });

  it('a mouse hover opens it, leaving closes it, and a click after hovering pins it open', async () => {
    render(<Example />);
    const key = screen.getByRole('button', { name: 'About watermarks' });
    fireEvent.pointerEnter(key, { pointerType: 'mouse' });
    await waitFor(() => expect(key).toHaveAttribute('aria-expanded', 'true'));
    fireEvent.pointerLeave(key, { pointerType: 'mouse' });
    await waitFor(() => expect(key).toHaveAttribute('aria-expanded', 'false'));
    fireEvent.pointerEnter(key, { pointerType: 'mouse' });
    await waitFor(() => expect(key).toHaveAttribute('aria-expanded', 'true'));
    fireEvent.click(key);
    fireEvent.pointerLeave(key, { pointerType: 'mouse' });
    await new Promise((r) => setTimeout(r, 250));
    expect(key).toHaveAttribute('aria-expanded', 'true');
  });

  it('a touch "hover" does not open it; only the tap does', async () => {
    render(<Example />);
    const key = screen.getByRole('button', { name: 'About watermarks' });
    fireEvent.pointerEnter(key, { pointerType: 'touch' });
    expect(key).toHaveAttribute('aria-expanded', 'false');
  });
});
