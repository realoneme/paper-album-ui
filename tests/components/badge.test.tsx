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
});
