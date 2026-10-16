import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slider } from '@/components/ui/slider';
import SliderDemo from '@/docs/demos/Slider.demo';

describe('Slider', () => {
  it('renders one labelled thumb with value aria', () => {
    render(<Slider aria-label="Film grain" defaultValue={[35]} className="extra" />);
    const thumb = screen.getByRole('slider', { name: 'Film grain' });
    expect(thumb).toHaveAttribute('aria-valuenow', '35');
    expect(thumb).toHaveAttribute('aria-valuemin', '0');
    expect(thumb).toHaveAttribute('aria-valuemax', '100');
    const root = thumb.closest('.pa-slider');
    expect(root).toHaveClass('pa-slider', 'extra');
    expect(root?.querySelector('.track > .range')).not.toBeNull();
  });

  it('moves with the keyboard and reports the change', async () => {
    const onValueChange = vi.fn();
    render(<Slider aria-label="Film grain" defaultValue={[35]} onValueChange={onValueChange} />);
    const thumb = screen.getByRole('slider');
    thumb.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(thumb).toHaveAttribute('aria-valuenow', '36');
    expect(onValueChange).toHaveBeenLastCalledWith([36]);
    await userEvent.keyboard('{End}');
    expect(thumb).toHaveAttribute('aria-valuenow', '100');
    await userEvent.keyboard('{Home}');
    expect(thumb).toHaveAttribute('aria-valuenow', '0');
  });

  it('labels both thumbs of a range and formats value text', () => {
    render(<Slider aria-label="Price" defaultValue={[80, 240]} max={400} formatValueText={(v) => `$${v}`} />);
    expect(screen.getByRole('slider', { name: 'Price, minimum' })).toHaveAttribute('aria-valuetext', '$80');
    expect(screen.getByRole('slider', { name: 'Price, maximum' })).toHaveAttribute('aria-valuenow', '240');
  });

  it('uses custom thumb labels', () => {
    render(<Slider thumbLabels={['From', 'To']} defaultValue={[1, 2]} />);
    expect(screen.getByRole('slider', { name: 'From' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'To' })).toBeInTheDocument();
  });

  it('demo updates the visible readout', async () => {
    render(<SliderDemo />);
    const grain = screen.getByRole('slider', { name: 'Film grain' });
    expect(screen.getByText('35%')).toBeInTheDocument();
    grain.focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(screen.getByText('36%')).toBeInTheDocument();
    expect(screen.getByText('$80 – $240')).toBeInTheDocument();
  });
});
