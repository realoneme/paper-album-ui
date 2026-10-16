import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from '@/components/ui/spinner';
import SpinnerDemo from '@/docs/demos/Spinner.demo';

describe('Spinner', () => {
  it('is a labelled image by default', () => {
    render(<Spinner className="mine" />);
    const img = screen.getByRole('img', { name: 'Loading' });
    expect(img).toHaveClass('pa-spinner', 'mine');
    expect(img.querySelector('.pa-spinner-arc')).toHaveAttribute('stroke-dasharray', '30 70');
  });

  it('takes a custom label and tone/size variants', () => {
    render(<Spinner label="Saving album" tone="primary" size="lg" />);
    expect(screen.getByRole('img', { name: 'Saving album' })).toHaveClass('primary', 'lg');
  });

  it('drops role and name when decorative', () => {
    const { container } = render(<Spinner aria-hidden tone="current" />);
    const svg = container.querySelector('svg');
    expect(svg).not.toHaveAttribute('role');
    expect(svg).not.toHaveAttribute('aria-label');
    expect(svg).toHaveClass('current');
  });

  it('demo button says what is happening', () => {
    render(<SpinnerDemo />);
    expect(screen.getByRole('img', { name: 'Loading' })).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: 'Uploading 12 photos' });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });
});
