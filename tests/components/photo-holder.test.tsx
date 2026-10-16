import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PhotoHolder, PhotoPlaceholder, type PhotoHolderVariant } from '@/components/ui/photo-holder';

const renderHolder = (variant: PhotoHolderVariant, extra: Partial<React.ComponentProps<typeof PhotoHolder>> = {}) =>
  render(
    <PhotoHolder variant={variant} {...extra}>
      <img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="Harbour at dusk" />
    </PhotoHolder>,
  );

describe('PhotoHolder', () => {
  it('corners: four wood corners around the photo', () => {
    const { container } = renderHolder('corners', { caption: 'Corners', className: 'extra' });
    const fig = screen.getByRole('figure');
    expect(fig.querySelector('figcaption.pa-caption')).toHaveTextContent('Corners');
    expect(fig).toHaveClass('pa-holder', 'extra');
    expect(fig).toHaveAttribute('data-variant', 'corners');
    const frame = container.querySelector('.pa-corners');
    expect(frame).not.toHaveClass('slit');
    expect(frame?.querySelectorAll(':scope > i[aria-hidden="true"]')).toHaveLength(4);
    expect(frame).toContainElement(screen.getByRole('img', { name: 'Harbour at dusk' }));
  });

  it('slits: page-coloured flaps on a print', () => {
    const { container } = renderHolder('slits');
    const frame = container.querySelector('.pa-corners.slit.pa-print');
    expect(frame).not.toBeNull();
    expect(frame?.querySelectorAll(':scope > i')).toHaveLength(4);
    expect(container.querySelector('figcaption')).toBeNull();
  });

  it('pocket: a tilted print tucked into a sleeve', () => {
    const { container } = renderHolder('pocket', { rotate: -2, caption: 'Pocket' });
    const pocket = container.querySelector('.pa-pocket');
    const print = pocket?.querySelector(':scope > .pa-print') as HTMLElement;
    expect(print.style.transform).toBe('rotate(-2deg)');
    expect(print).toContainElement(screen.getByRole('img'));
    const sleeve = pocket?.querySelector(':scope > .sleeve');
    expect(sleeve).toHaveAttribute('aria-hidden', 'true');
    expect(sleeve?.querySelector('svg path')).not.toBeNull();
    expect(container.querySelector('.pa-corners')).toBeNull();
  });

  it('tape: a print with tape and a handwritten note, rotation clamped to ±8°', () => {
    const { container } = renderHolder('tape', { rotate: 20, note: 'Lisbon, May' });
    const print = container.querySelector('.pa-print') as HTMLElement;
    expect(print.style.transform).toBe('rotate(8deg)');
    expect(print.querySelector('.pa-tape')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Lisbon, May')).toHaveClass('cap');
  });

  it('PhotoPlaceholder is decorative unless labelled', () => {
    const { rerender } = render(<PhotoPlaceholder tone={3} className="extra" />);
    const ph = document.querySelector('.pa-photo');
    expect(ph).toHaveClass('ph-3', 'extra');
    expect(ph).toHaveAttribute('aria-hidden', 'true');
    rerender(<PhotoPlaceholder role="img" aria-label="Forest" />);
    expect(screen.getByRole('img', { name: 'Forest' })).toHaveClass('ph-1');
  });
});
