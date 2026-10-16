import { afterEach, describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster, ToastPreview, toast } from '@/components/ui/sonner';

afterEach(() => {
  act(() => {
    toast.dismiss();
  });
});

describe('Sonner', () => {
  it('shows a styled toast after a click', async () => {
    render(
      <>
        <button type="button" onClick={() => toast.success('12 photos uploaded', { description: 'Added to the album.' })}>
          Upload
        </button>
        <Toaster />
      </>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Upload' }));
    const title = await screen.findByText('12 photos uploaded');
    expect(title).toHaveClass('pa-toast-title');
    const toastEl = title.closest('[data-sonner-toast]');
    expect(toastEl).toHaveClass('pa-pop', 'pa-toast', 'success');
    expect(toastEl).toHaveAttribute('data-styled', 'false');
    expect(screen.getByText('Added to the album.')).toHaveClass('pa-toast-desc');
    expect(toastEl?.querySelector('.pa-toast-icon svg')).not.toBeNull();
  });

  it('gives error toasts the error tone and renders the action as a paper key', async () => {
    render(<Toaster />);
    act(() => {
      toast.error('Upload failed', { action: { label: 'Retry', onClick: () => {} } });
    });
    const toastEl = (await screen.findByText('Upload failed')).closest('[data-sonner-toast]');
    expect(toastEl).toHaveClass('pa-toast', 'error');
    expect(screen.getByRole('button', { name: 'Retry' })).toHaveClass('pa-btn', 'pa-btn-secondary', 'pa-btn-sm');
  });

  it('renders a static preview with the same classes and roles', () => {
    render(
      <>
        <ToastPreview title="Saved" description="All good." className="mine" />
        <ToastPreview tone="error" title="Failed" action={<button type="button">Retry</button>} />
      </>,
    );
    expect(screen.getByRole('status')).toHaveClass('pa-pop', 'pa-toast', 'success', 'mine');
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('pa-toast', 'error');
    expect(alert).toHaveTextContent('Failed');
    expect(alert.querySelector('.pa-toast-icon')).toHaveAttribute('aria-hidden', 'true');
  });
});
