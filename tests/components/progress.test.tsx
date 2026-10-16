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
    } finally {
      vi.useRealTimers();
    }
  });
});
