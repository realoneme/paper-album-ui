import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle } from '@/components/ui/toggle';

describe('Toggle', () => {
  it('renders a button with aria-pressed and merges className', () => {
    render(<Toggle className="extra">Captions</Toggle>);
    const btn = screen.getByRole('button', { name: 'Captions' });
    expect(btn).toHaveClass('pa-toggle', 'extra');
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('toggles on click and keyboard', async () => {
    const onPressedChange = vi.fn();
    render(<Toggle onPressedChange={onPressedChange}>EXIF</Toggle>);
    const btn = screen.getByRole('button', { name: 'EXIF' });
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    expect(btn).toHaveAttribute('data-state', 'on');
    expect(onPressedChange).toHaveBeenLastCalledWith(true);
    btn.focus();
    await userEvent.keyboard(' ');
    expect(btn).toHaveAttribute('aria-pressed', 'false');
  });

  it('supports defaultPressed and disabled', async () => {
    render(<Toggle defaultPressed disabled>Grid</Toggle>);
    const btn = screen.getByRole('button', { name: 'Grid' });
    expect(btn).toBeDisabled();
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });
});
