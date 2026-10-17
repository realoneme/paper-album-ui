import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge, badgeVariants } from '@/components/ui/badge';
import BadgeDemo from '@/docs/demos/Badge.demo';

const variants = ['default', 'secondary', 'outline', 'destructive', 'seal', 'wood', 'success', 'warning', 'info'] as const;

describe('Badge', () => {
  it('defaults to the default variant and merges className', () => {
    render(<Badge className="mine">Published</Badge>);
    const badge = screen.getByText('Published');
    expect(badge.tagName).toBe('SPAN');
    expect(badge).toHaveClass('pa-badge', 'pa-badge-default', 'mine');
  });

  it.each(variants)('applies the %s variant class', (variant) => {
    render(<Badge variant={variant}>Tag</Badge>);
    expect(screen.getByText('Tag')).toHaveClass(`pa-badge-${variant}`);
    expect(badgeVariants({ variant })).toBe(`pa-badge pa-badge-${variant}`);
  });

  it.each([
    ['sm', 'pa-badge-sm'],
    ['xs', 'pa-badge-xs'],
  ] as const)('applies the %s size class', (size, cls) => {
    render(<Badge size={size} variant="warning">Tag</Badge>);
    expect(screen.getByText('Tag')).toHaveClass('pa-badge', 'pa-badge-warning', cls);
    expect(badgeVariants({ variant: 'warning', size })).toBe(`pa-badge pa-badge-warning ${cls}`);
  });

  it('adds no size class at the default size', () => {
    render(<Badge size="default">Tag</Badge>);
    const badge = screen.getByText('Tag');
    expect(badge).not.toHaveClass('pa-badge-sm');
    expect(badge).not.toHaveClass('pa-badge-xs');
  });

  it('renders its child with asChild', () => {
    render(<Badge asChild variant="outline"><a href="#film">Film</a></Badge>);
    expect(screen.getByRole('link', { name: 'Film' })).toHaveClass('pa-badge', 'pa-badge-outline');
  });

  it('demo pairs semantic badges with icons', () => {
    render(<BadgeDemo />);
    for (const name of ['Paid', 'Pending', 'New', 'Refunded']) {
      const badge = screen.getByText(name);
      expect(badge.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
    }
    expect(screen.getByText('Featured')).toHaveClass('pa-badge-seal');
  });

  it('demo shows all three sizes', () => {
    const { container } = render(<BadgeDemo />);
    expect(container.querySelectorAll('.pa-badge-sm')).toHaveLength(4);
    expect(container.querySelectorAll('.pa-badge-xs')).toHaveLength(4);
    expect(container.querySelector('[data-size="xs"] .pa-badge-warning')).toHaveTextContent('In review');
  });
});
