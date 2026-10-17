import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import AlertDialogDemo from '@/docs/demos/AlertDialog.demo';

function Example({ onDelete = () => {} }: { onDelete?: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Delete album</AlertDialogTrigger>
      <AlertDialogContent className="custom">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this album?</AlertDialogTitle>
          <AlertDialogDescription>Originals stay in your library.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep album</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const rect = (left: number, top: number, width: number, height: number) =>
  ({ left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => ({}) }) as DOMRect;

afterEach(() => vi.restoreAllMocks());

describe('AlertDialog', () => {
  it('opens as an alertdialog with title, description and merged classes', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Delete album' }));
    const dialog = screen.getByRole('alertdialog', { name: 'Delete this album?' });
    expect(dialog).toHaveAccessibleDescription('Originals stay in your library.');
    expect(dialog).toHaveClass('pa-pop', 'pa-dialog', 'custom');
  });

  it('focuses the safe action and styles both actions as buttons', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Delete album' }));
    const cancel = screen.getByRole('button', { name: 'Keep album' });
    expect(cancel).toHaveFocus();
    expect(cancel).toHaveClass('pa-btn', 'pa-btn-secondary');
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass('pa-btn', 'pa-btn-destructive');
  });

  it('closes on Escape and on Cancel; the action runs then closes', async () => {
    const onDelete = vi.fn();
    render(<Example onDelete={onDelete} />);
    const trigger = screen.getByRole('button', { name: 'Delete album' });
    await userEvent.click(trigger);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('button', { name: 'Keep album' }));
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('demo shows a static preview, then the real alert dialog inside its stage', async () => {
    render(<AlertDialogDemo />);
    expect(screen.getByTestId('alert-preview')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Delete album' }));
    expect(screen.queryByTestId('alert-preview')).not.toBeInTheDocument();
    const dialog = screen.getByRole('alertdialog', { name: 'Delete this album?' });
    expect(dialog.closest('.pa-stage')).not.toBeNull();
  });

  it('grows out of its trigger: FLIP custom properties come from the trigger rect', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      if (this.getAttribute('role') === 'alertdialog') return rect(200, 100, 440, 240);
      if (this.tagName === 'BUTTON' && this.textContent === 'Delete album') return rect(40, 400, 120, 44);
      return rect(0, 0, 0, 0);
    });
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Delete album' }));
    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toHaveClass('pa-grow');
    expect(dialog).toHaveAttribute('data-from', 'trigger');
    expect(dialog.style.getPropertyValue('--from-x')).toBe('-320px');
    expect(dialog.style.getPropertyValue('--from-y')).toBe('202px');
    expect(dialog.style.getPropertyValue('--from-sx')).toBe('0.273');
    expect(dialog.style.getPropertyValue('--from-sy')).toBe('0.183');
    expect(document.querySelector('.pa-backdrop')).toHaveClass('pa-fade');
  });
});
