import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';

describe('ScrollArea', () => {
  it('renders a focusable, labelled region when given a label', () => {
    const { container } = render(
      <ScrollArea label="Photo tags" className="extra" style={{ height: 120 }}>
        <p>Snow</p>
      </ScrollArea>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('pa-scroll-area', 'extra');
    expect(root.style.height).toBe('120px');
    const region = screen.getByRole('region', { name: 'Photo tags' });
    expect(region).toHaveClass('pa-scroll-viewport');
    expect(region).toHaveAttribute('tabindex', '0');
    expect(region).toHaveTextContent('Snow');
  });

  it('has no region role without a label', () => {
    render(<ScrollArea><p>Snow</p></ScrollArea>);
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
    expect(screen.getByText('Snow').closest('.pa-scroll-viewport')).not.toBeNull();
  });

  it('renders the groove when the bar is always shown', () => {
    const { container } = render(
      <ScrollAreaPrimitive.Root type="always">
        <ScrollAreaPrimitive.Viewport>content</ScrollAreaPrimitive.Viewport>
        <ScrollBar orientation="horizontal" className="extra-bar" />
      </ScrollAreaPrimitive.Root>,
    );
    const bar = container.querySelector('.pa-scrollbar');
    expect(bar).toHaveClass('extra-bar');
    expect(bar).toHaveAttribute('data-orientation', 'horizontal');
  });
});
