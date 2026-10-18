import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders a type="button" with the default variant', () => {
    render(<Button>Save</Button>);
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn).toHaveAttribute('type', 'button');
    expect(btn).toHaveClass('pa-btn', 'pa-btn-default');
  });

  it('applies variant and size classes', () => {
    render(<Button variant="seal" size="lg">Book</Button>);
    expect(screen.getByRole('button')).toHaveClass('pa-btn-seal', 'pa-btn-lg');
  });

  it('calls onClick and respects disabled', async () => {
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(<Button onClick={onClick} disabled>Go</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders its child with asChild', () => {
    render(<Button asChild variant="link"><a href="#albums">Albums</a></Button>);
    const link = screen.getByRole('link', { name: 'Albums' });
    expect(link).toHaveClass('pa-btn', 'pa-btn-link');
    expect(link).not.toHaveAttribute('type');
  });

  it('a trackpad tap (down and up at once) still shows the press for a moment', async () => {
    const onPointerDown = vi.fn();
    render(<Button onPointerDown={onPointerDown}>Book</Button>);
    const btn = screen.getByRole('button', { name: 'Book' });
    fireEvent.pointerDown(btn, { button: 0 });
    fireEvent.pointerUp(btn, { button: 0 });
    expect(onPointerDown).toHaveBeenCalled();
    expect(btn).toHaveAttribute('data-pressed');
    await waitFor(() => expect(btn).not.toHaveAttribute('data-pressed'), { timeout: 400 });
  });

  it('Enter and Space press the key; a disabled key never shows a press', () => {
    render(<Button>Book</Button>);
    const btn = screen.getByRole('button', { name: 'Book' });
    fireEvent.keyDown(btn, { key: 'Enter' });
    expect(btn).toHaveAttribute('data-pressed');
    render(<Button disabled>Off</Button>);
    const off = screen.getByRole('button', { name: 'Off' });
    fireEvent.pointerDown(off, { button: 0 });
    fireEvent.keyDown(off, { key: ' ' });
    expect(off).not.toHaveAttribute('data-pressed');
  });
});
