import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton } from '@/components/ui/skeleton';
import SkeletonDemo from '@/docs/demos/Skeleton.demo';

describe('Skeleton', () => {
  it('renders a hidden shimmer block with merged classes and styles', () => {
    const { container } = render(<Skeleton className="mine" style={{ width: 96 }} />);
    const el = container.firstElementChild;
    expect(el).toHaveClass('pa-skel', 'mine');
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el).toHaveStyle({ width: '96px' });
  });

  it('demo announces loading through a labelled status', () => {
    render(<SkeletonDemo />);
    const status = screen.getByRole('status', { name: 'Loading album' });
    expect(status.querySelectorAll('.pa-skel')).toHaveLength(4);
  });
});
