import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

// jsdom has no layout (and no stylesheet): Embla measures offsetLeft/offsetWidth and reads slide margins,
// so give the viewport and slides sizes and the slides an inline margin.
const originals = {
  width: Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth'),
  left: Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetLeft'),
};
function slideIndex(el: HTMLElement) {
  return el.parentElement ? Array.from(el.parentElement.children).indexOf(el) : 0;
}
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get(this: HTMLElement) {
      if (this.classList.contains('slide')) return 700;
      if (this.classList.contains('pa-carousel') || this.classList.contains('track')) return 1000;
      return 0;
    },
  });
  Object.defineProperty(HTMLElement.prototype, 'offsetLeft', {
    configurable: true,
    get(this: HTMLElement) {
      return this.classList.contains('slide') ? slideIndex(this) * 720 : 0;
    },
  });
});
afterAll(() => {
  if (originals.width) Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originals.width);
  if (originals.left) Object.defineProperty(HTMLElement.prototype, 'offsetLeft', originals.left);
});

function Demo() {
  return (
    <Carousel aria-label="Featured prints" className="mine">
      <CarouselContent>
        {['Otaru, dawn', 'Harbour fog', 'Pine road'].map((c, i) => (
          <CarouselItem key={c} aria-label={`${i + 1} of 3`} style={{ margin: "0 20px 0 0" }}>
            {c}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselControls>
        <CarouselPrevious />
        <CarouselDots count={3} />
        <CarouselNext />
      </CarouselControls>
    </Carousel>
  );
}

describe('Carousel', () => {
  it('renders a labelled carousel region with slide groups', () => {
    render(<Demo />);
    const region = screen.getByRole('region', { name: 'Featured prints' });
    expect(region).toHaveAttribute('aria-roledescription', 'carousel');
    expect(region).toHaveClass('pa-carousel-root', 'mine');
    const slides = screen.getAllByRole('group');
    expect(slides).toHaveLength(3);
    expect(slides[0]).toHaveAttribute('aria-roledescription', 'slide');
    expect(slides[0]).toHaveClass('slide');
    expect(slides[0]!.parentElement).toHaveClass('track');
    expect(slides[0]!.parentElement!.parentElement).toHaveClass('pa-carousel');
  });

  it('has labelled previous and next buttons and dots', () => {
    render(<Demo />);
    const prev = screen.getByRole('button', { name: 'Previous slide' });
    const next = screen.getByRole('button', { name: 'Next slide' });
    expect(prev).toHaveClass('pa-btn');
    expect(next).toHaveClass('pa-btn');
    // On the first slide there is nothing to go back to.
    expect(prev).toBeDisabled();
    const dots = screen.getAllByRole('button', { name: /Go to slide/ });
    expect(dots).toHaveLength(3);
    expect(dots[0]).toHaveAttribute('aria-current', 'true');
    expect(dots[0]!.parentElement).toHaveClass('pa-dots');
  });

  it('marks the first slide as current once Embla is ready', async () => {
    render(<Demo />);
    const first = screen.getByRole('group', { name: '1 of 3' });
    await expect.poll(() => first.getAttribute('aria-current')).toBe('true');
    expect(screen.getByRole('group', { name: '2 of 3' })).not.toHaveAttribute('aria-current');
  });

  it('pages with Next, Previous and the dots', async () => {
    render(<Demo />);
    const user = userEvent.setup();
    const next = screen.getByRole('button', { name: 'Next slide' });
    const prev = screen.getByRole('button', { name: 'Previous slide' });
    await expect.poll(() => next.hasAttribute('disabled')).toBe(false);
    await user.click(next);
    await expect.poll(() => screen.getByRole('group', { name: '2 of 3' }).getAttribute('aria-current')).toBe('true');
    expect(screen.getByRole('group', { name: '1 of 3' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('button', { name: 'Go to slide 2' })).toHaveAttribute('aria-current', 'true');
    expect(prev).toBeEnabled();
    await user.click(screen.getByRole('button', { name: 'Go to slide 3' }));
    await expect.poll(() => screen.getByRole('group', { name: '3 of 3' }).getAttribute('aria-current')).toBe('true');
    await expect.poll(() => next.hasAttribute('disabled')).toBe(true);
    await user.click(prev);
    await expect.poll(() => screen.getByRole('group', { name: '2 of 3' }).getAttribute('aria-current')).toBe('true');
  });
});
