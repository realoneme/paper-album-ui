import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  type SheetContentProps,
} from '@/components/ui/sheet';
import SheetDemo from '@/docs/demos/Sheet.demo';

function Example({ side }: { side?: SheetContentProps['side'] }) {
  return (
    <Sheet>
      <SheetTrigger>Details</SheetTrigger>
      <SheetContent side={side} className="custom">
        <SheetHeader>
          <SheetTitle>Photo details</SheetTitle>
          <SheetDescription>Frame 12.</SheetDescription>
        </SheetHeader>
        <SheetClose>Done</SheetClose>
      </SheetContent>
    </Sheet>
  );
}

describe('Sheet', () => {
  it('opens a dialog on the right edge by default with merged classes', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Details' }));
    const sheet = screen.getByRole('dialog', { name: 'Photo details' });
    expect(sheet).toHaveAccessibleDescription('Frame 12.');
    expect(sheet).toHaveClass('pa-pop', 'pa-sheet', 'pa-fixed', 'custom');
    expect(sheet).toHaveAttribute('data-side', 'right');
    expect(sheet).not.toHaveClass('pa-sheet-left');
  });

  it.each(['left', 'top', 'bottom'] as const)('applies the %s side class', async (side) => {
    render(<Example side={side} />);
    await userEvent.click(screen.getByRole('button', { name: 'Details' }));
    expect(screen.getByRole('dialog')).toHaveClass(`pa-sheet-${side}`);
  });

  it('closes with Escape, the close button and SheetClose', async () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Details' });
    await userEvent.click(trigger);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('demo starts open in its stage and can be closed and reopened', async () => {
    render(<SheetDemo />);
    const sheet = screen.getByRole('dialog', { name: 'Photo details' });
    expect(sheet.closest('.pa-stage')).not.toBeNull();
    expect(sheet).not.toHaveClass('pa-fixed');
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Photo details' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('animates with its side and a fading backdrop', async () => {
    render(<Example side="left" />);
    await userEvent.click(screen.getByRole('button', { name: 'Details' }));
    const sheet = screen.getByRole('dialog');
    expect(sheet).toHaveAttribute('data-state', 'open');
    expect(sheet).toHaveAttribute('data-side', 'left');
    expect(document.querySelector('.pa-backdrop')).toHaveClass('pa-fade');
  });
});
