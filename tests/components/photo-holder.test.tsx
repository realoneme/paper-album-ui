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
    const corners = frame?.querySelectorAll(':scope > svg.pa-corner[aria-hidden="true"]');
    expect(corners).toHaveLength(4);
    expect([...corners!].map((c) => c.getAttribute('data-corner'))).toEqual(['tl', 'tr', 'br', 'bl']);
    // each corner has its own sheen gradient
    const fills = [...corners!].map((c) => c.querySelectorAll('path')[1].getAttribute('fill'));
    expect(new Set(fills).size).toBe(4);
    expect(frame).toContainElement(screen.getByRole('img', { name: 'Harbour at dusk' }));
  });

  it('slits: page-coloured flaps on a print', () => {
    const { container } = renderHolder('slits');
    const frame = container.querySelector('.pa-corners.slit.pa-print');
    expect(frame).not.toBeNull();
    expect(frame?.querySelectorAll(':scope > svg.pa-corner')).toHaveLength(4);
    expect(container.querySelector('figcaption')).toBeNull();
  });

  it('pocket: a tilted print tucked into a sleeve that names it', () => {
    const { container } = renderHolder('pocket', { rotate: -2, caption: 'Pocket', note: 'Otaru harbour' });
    const pocket = container.querySelector('.pa-pocket');
    const print = pocket?.querySelector(':scope > .pa-print') as HTMLElement;
    expect(print.style.getPropertyValue('--pa-tilt')).toBe('-2deg');
    expect(print).toContainElement(screen.getByRole('img'));
    const sleeve = pocket?.querySelector(':scope > .sleeve');
    expect(sleeve?.querySelector('svg[aria-hidden="true"] path')).not.toBeNull();
    expect(sleeve?.querySelector('.sleeve-note')).toHaveTextContent('Otaru harbour');
    expect(container.querySelector('.pa-corners')).toBeNull();
  });

  it('tape: a print with tape and a handwritten note, rotation clamped to ±8°', () => {
    const { container } = renderHolder('tape', { rotate: 20, note: 'Lisbon, May' });
    const print = container.querySelector('.pa-print') as HTMLElement;
    expect(print.style.getPropertyValue('--pa-tilt')).toBe('8deg');
    expect(print).toHaveClass('pa-holder-tape');
    expect(print.querySelector('.pa-tape')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Lisbon, May')).toHaveClass('cap');
  });

  it('polaroid: an instant print with the name in its margin', () => {
    const { container } = renderHolder('polaroid', { rotate: -1.5, note: 'Kyoto, 2019' });
    const print = container.querySelector('.pa-holder-polaroid.pa-print') as HTMLElement;
    expect(print.style.getPropertyValue('--pa-tilt')).toBe('-1.5deg');
    expect(print).toContainElement(screen.getByRole('img'));
    expect(screen.getByText('Kyoto, 2019')).toHaveClass('pa-polaroid-note');
    expect(container.querySelector('.pa-corner, .pa-tape')).toBeNull();
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
