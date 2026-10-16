import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Separator } from '@/components/ui/separator';

describe('Separator', () => {
  it('is decorative by default (no separator role) with the pa-hr rule', () => {
    const { container } = render(<Separator className="extra" />);
    const el = container.firstElementChild;
    expect(el).toHaveClass('pa-hr', 'extra');
    expect(el).toHaveAttribute('role', 'none');
    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
  });

  it('exposes a semantic vertical separator', () => {
    render(<Separator orientation="vertical" decorative={false} />);
    const sep = screen.getByRole('separator');
    expect(sep).toHaveClass('pa-vr');
    expect(sep).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('exposes a semantic horizontal separator', () => {
    render(<Separator decorative={false} />);
    expect(screen.getByRole('separator')).toHaveClass('pa-hr');
  });

  it('renders the cut-paper wave as an svg path', () => {
    const { container } = render(<Separator variant="wave" orientation="vertical" />);
    const el = container.firstElementChild;
    expect(el).toHaveClass('pa-wave');
    expect(el).not.toHaveClass('pa-vr');
    expect(el?.querySelector('svg[aria-hidden="true"] path')).not.toBeNull();
  });
});
