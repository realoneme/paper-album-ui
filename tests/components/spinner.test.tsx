import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from '@/components/ui/spinner';
import SpinnerDemo from '@/docs/demos/Spinner.demo';

describe('Spinner', () => {
  it('is a labelled status by default', () => {
    render(<Spinner className="mine" />);
    const status = screen.getByRole('status', { name: 'Loading' });
    expect(status).toHaveClass('pa-spinner', 'pa-spinner-goo', 'mine');
    // A lead ball plus a tail of progressively smaller balls.
    const radii = Array.from(status.querySelectorAll('circle.pa-spinner-ball'), (c) => Number(c.getAttribute('r')));
    expect(radii.length).toBeGreaterThan(3);
    expect([...radii].sort((a, b) => b - a)).toEqual(radii);
  });

  it('melts the balls with a goo filter whose id is unique per instance', () => {
    const { container } = render(<><Spinner label="One" /><Spinner label="Two" /></>);
    const filters = Array.from(container.querySelectorAll('filter'));
    expect(filters).toHaveLength(2);
    const ids = filters.map((f) => f.id);
    expect(new Set(ids).size).toBe(2);
    for (const filter of filters) {
      expect(filter.id).toMatch(/^[A-Za-z][\w-]*$/);
      expect(filter.querySelector('feGaussianBlur')).not.toBeNull();
      expect(filter.querySelector('feColorMatrix')?.getAttribute('values')).toMatch(/0 0 0 18 -7$/);
      const svg = filter.closest('svg');
      expect(svg?.querySelector(`g[filter="url(#${filter.id})"]`)).not.toBeNull();
    }
  });

  it('takes a custom label and tone/size variants', () => {
    render(<Spinner label="Saving album" tone="primary" size="lg" />);
    expect(screen.getByRole('status', { name: 'Saving album' })).toHaveClass('primary', 'lg');
  });

  it('drops role and name when decorative', () => {
    const { container } = render(<Spinner aria-hidden tone="current" />);
    const svg = container.querySelector('svg');
    expect(svg).not.toHaveAttribute('role');
    expect(svg).not.toHaveAttribute('aria-label');
    expect(svg).toHaveClass('current');
  });

  it('demo button says what is happening', () => {
    render(<SpinnerDemo />);
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Uploading 12 photos' }).querySelector('svg.pa-spinner')).toHaveClass('current');
    const btn = screen.getByRole('button', { name: 'Uploading 12 photos' });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });
});
