import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

describe('AspectRatio', () => {
  it('reserves the ratio and fills the frame', () => {
    render(
      <AspectRatio ratio={16 / 9} className="ph-1" data-testid="frame">
        <img src="/otaru.jpg" alt="Otaru at dawn" />
      </AspectRatio>,
    );
    const frame = screen.getByTestId('frame');
    expect(frame).toHaveClass('pa-ratio', 'ph-1');
    expect(frame).toHaveStyle({ position: 'absolute' });
    expect(frame.parentElement).toHaveStyle({ paddingBottom: '56.25%' });
    expect(screen.getByRole('img', { name: 'Otaru at dawn' })).toBeInTheDocument();
  });
});
