import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

function Demo() {
  return (
    <ResizablePanelGroup direction="horizontal" className="extra">
      <ResizablePanel defaultSize={32}>Albums</ResizablePanel>
      <ResizableHandle aria-label="Resize panels" />
      <ResizablePanel defaultSize={68} bare>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={60}>Preview</ResizablePanel>
          <ResizableHandle aria-label="Resize preview" />
          <ResizablePanel defaultSize={40}>Notes</ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

describe('Resizable', () => {
  it('renders framed groups, padded panes and direction-aware handles', () => {
    const { container } = render(<Demo />);
    expect(container.firstElementChild).toHaveClass('pa-resizable', 'extra');
    expect(screen.getByText('Albums')).toHaveClass('pane');
    expect(screen.getByText('Albums')).toHaveAttribute('data-panel-size', '32.0');
    expect(screen.getByText('Preview')).toHaveClass('pane');
    const v = screen.getByRole('separator', { name: 'Resize panels' });
    expect(v).toHaveClass('pa-handle-v');
    expect(v).toHaveAttribute('aria-orientation', 'vertical');
    const h = screen.getByRole('separator', { name: 'Resize preview' });
    expect(h).toHaveClass('pa-handle-h');
    expect(h).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('handles are keyboard-focusable (the library resizes with the arrow keys)', async () => {
    render(<Demo />);
    const v = screen.getByRole('separator', { name: 'Resize panels' });
    expect(v).toHaveAttribute('tabindex', '0');
    await userEvent.tab();
    expect(v).toHaveFocus();
    expect(v).toHaveAttribute('data-resize-handle-active', 'keyboard');
  });
});
