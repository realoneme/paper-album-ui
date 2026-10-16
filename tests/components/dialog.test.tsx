import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import DialogDemo from '@/docs/demos/Dialog.demo';

function Example({ container }: { container?: HTMLElement | null }) {
  return (
    <Dialog>
      <DialogTrigger>Edit album</DialogTrigger>
      <DialogContent className="custom" container={container}>
        <DialogHeader>
          <DialogTitle>Edit album</DialogTitle>
          <DialogDescription>Changes show right away.</DialogDescription>
        </DialogHeader>
        <input aria-label="Title" />
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe('Dialog', () => {
  it('opens from the trigger with title, description and merged classes', async () => {
    render(<Example />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Edit album' }));
    const dialog = screen.getByRole('dialog', { name: 'Edit album' });
    expect(dialog).toHaveAccessibleDescription('Changes show right away.');
    expect(dialog).toHaveClass('pa-pop', 'pa-dialog', 'pa-fixed', 'custom');
    expect(screen.getByText('Edit album', { selector: 'h2' })).toHaveClass('pa-dialog-title');
    expect(document.querySelector('.pa-backdrop')).toBeInTheDocument();
  });

  it('closes with Escape and returns focus to the trigger', async () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Edit album' });
    await userEvent.click(trigger);
    expect(screen.getByRole('dialog')).toContainElement(document.activeElement as HTMLElement);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes from the labelled close button and from DialogClose', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Edit album' }));
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Edit album' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('portals into a container without the fixed modifier', async () => {
    const stage = document.createElement('div');
    document.body.appendChild(stage);
    render(<Example container={stage} />);
    await userEvent.click(screen.getByRole('button', { name: 'Edit album' }));
    const dialog = screen.getByRole('dialog');
    expect(stage).toContainElement(dialog);
    expect(dialog).not.toHaveClass('pa-fixed');
    stage.remove();
  });

  it('demo starts open inside its stage without taking focus, and can be closed and reopened', async () => {
    render(<DialogDemo />);
    const dialog = screen.getByRole('dialog', { name: 'Edit album' });
    expect(dialog.closest('.pa-stage')).not.toBeNull();
    expect(dialog).not.toContainElement(document.activeElement as HTMLElement);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Edit album' }));
    expect(screen.getByRole('dialog')).toContainElement(document.activeElement as HTMLElement);
  });
});
