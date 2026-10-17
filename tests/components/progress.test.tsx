import { describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { Progress } from '@/components/ui/progress';
import ProgressDemo from '@/docs/demos/Progress.demo';

describe('Progress', () => {
  it('exposes progressbar value aria and fills to the value', () => {
    render(<Progress aria-label="IMG_2034.jpg" value={64} className="mine" />);
    const bar = screen.getByRole('progressbar', { name: 'IMG_2034.jpg' });
    expect(bar).toHaveAttribute('aria-valuenow', '64');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveClass('pa-progress', 'mine');
    expect(bar).not.toHaveClass('done');
    expect(bar.querySelector('span')).toHaveStyle({ width: '64%' });
  });

  it('sweeps a glow over the fill below 100 and drops it when done', () => {
    const { rerender } = render(<Progress aria-label="Upload" value={40} />);
    const bar = screen.getByRole('progressbar');
    const fill = bar.querySelector('.pa-progress-fill');
    expect(fill).toHaveStyle({ width: '40%' });
    expect(fill?.querySelector('.pa-progress-glow')).not.toBeNull();
    rerender(<Progress aria-label="Upload" value={88} />);
    expect(bar).toHaveAttribute('aria-valuenow', '88');
    expect(bar.querySelector('.pa-progress-fill')).toHaveStyle({ width: '88%' });
    rerender(<Progress aria-label="Upload" value={100} />);
    expect(bar).toHaveClass('done');
    expect(bar.querySelector('.pa-progress-fill')).toHaveStyle({ width: '100%' });
    expect(bar.querySelector('.pa-progress-glow')).toBeNull();
  });

  it('marks completion with .done and scales by max', () => {
    const { rerender } = render(<Progress aria-label="Export" value={100} />);
    expect(screen.getByRole('progressbar')).toHaveClass('done');
    rerender(<Progress aria-label="Export" value={5} max={20} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '20');
    expect(screen.getByRole('progressbar').querySelector('span')).toHaveStyle({ width: '25%' });
  });

  it('is indeterminate without a value', () => {
    render(<Progress aria-label="Preparing" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar).toHaveAttribute('data-state', 'indeterminate');
    expect(bar).toHaveClass('indeterminate');
    expect(bar).not.toHaveClass('done');
    const fill = bar.querySelector<HTMLElement>('.pa-progress-fill');
    expect(fill?.style.width).toBe('');
    expect(fill?.querySelector('.pa-progress-glow')).not.toBeNull();
  });

  it('treats a null value as indeterminate', () => {
    render(<Progress aria-label="Preparing" value={null} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar).toHaveClass('indeterminate');
  });

  it('demo labels each upload and keeps uploading', () => {
    vi.useFakeTimers();
    try {
      render(<ProgressDemo />);
      expect(screen.getByRole('progressbar', { name: 'IMG_2033.jpg' })).toHaveAttribute('aria-valuenow', '100');
      const running = screen.getByRole('progressbar', { name: 'IMG_2034.jpg' });
      expect(running).toHaveAttribute('aria-valuenow', '64');
      act(() => { vi.advanceTimersByTime(600); });
      expect(running).toHaveAttribute('aria-valuenow', '68');
      const exporting = screen.getByRole('progressbar', { name: 'Album export' });
      expect(exporting).not.toHaveAttribute('aria-valuenow');
      expect(exporting).toHaveAttribute('data-state', 'indeterminate');
    } finally {
      vi.useRealTimers();
    }
  });
});
