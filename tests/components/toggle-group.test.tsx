import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

function Single(props: { onValueChange?: (v: string) => void }) {
  return (
    <ToggleGroup type="single" defaultValue="grid" aria-label="Gallery layout" className="extra" onValueChange={props.onValueChange}>
      <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
      <ToggleGroupItem value="list">List</ToggleGroupItem>
      <ToggleGroupItem value="masonry" disabled>Masonry</ToggleGroupItem>
    </ToggleGroup>
  );
}

describe('ToggleGroup', () => {
  it('single mode renders a radiogroup with aria-checked items', () => {
    render(<Single />);
    const group = screen.getByRole('radiogroup', { name: 'Gallery layout' });
    expect(group).toHaveClass('pa-tgroup', 'extra');
    expect(screen.getByRole('radio', { name: 'Grid' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'List' })).toHaveAttribute('aria-checked', 'false');
  });

  it('selects on click and moves focus with arrow keys', async () => {
    const onValueChange = vi.fn();
    render(<Single onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('radio', { name: 'List' }));
    expect(onValueChange).toHaveBeenLastCalledWith('list');
    expect(screen.getByRole('radio', { name: 'List' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Grid' })).toHaveAttribute('aria-checked', 'false');
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('radio', { name: 'Grid' })).toHaveFocus();
  });

  it('does not select disabled items', async () => {
    render(<Single />);
    const masonry = screen.getByRole('radio', { name: 'Masonry' });
    expect(masonry).toBeDisabled();
    await userEvent.click(masonry);
    expect(masonry).toHaveAttribute('aria-checked', 'false');
  });

  it('multiple mode uses aria-pressed', async () => {
    render(
      <ToggleGroup type="multiple" aria-label="Overlays">
        <ToggleGroupItem value="captions">Captions</ToggleGroupItem>
        <ToggleGroupItem value="exif">EXIF</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(screen.getByRole('toolbar', { name: 'Overlays' })).toHaveClass('pa-tgroup');
    const captions = screen.getByRole('button', { name: 'Captions' });
    const exif = screen.getByRole('button', { name: 'EXIF' });
    await userEvent.click(captions);
    await userEvent.click(exif);
    expect(captions).toHaveAttribute('aria-pressed', 'true');
    expect(exif).toHaveAttribute('aria-pressed', 'true');
  });

  describe('sliding thumb', () => {
    // jsdom has no layout: give the strip and each item a fixed rect.
    const RECTS: Record<string, { left: number; width: number }> = {
      Grid: { left: 15, width: 60 },
      List: { left: 79, width: 50 },
      Masonry: { left: 133, width: 90 },
    };
    const rect = (left: number, width: number) =>
      ({ left, top: 10, width, height: 40, right: left + width, bottom: 50, x: left, y: 10, toJSON: () => ({}) }) as DOMRect;
    const mockLayout = () =>
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
        if (this.classList.contains('pa-tgroup')) return rect(10, 300);
        const r = RECTS[this.textContent ?? ''];
        return r ? rect(r.left, r.width) : rect(0, 0);
      });
    afterEach(() => vi.restoreAllMocks());

    const thumbOf = (group: HTMLElement) => group.querySelector<HTMLElement>('.pa-tgroup-thumb');

    it('renders one hidden thumb under the selected item, first without animation', () => {
      mockLayout();
      render(<Single />);
      const group = screen.getByRole('radiogroup');
      const thumbs = group.querySelectorAll('.pa-tgroup-thumb');
      expect(thumbs).toHaveLength(1);
      const thumb = thumbs[0] as HTMLElement;
      expect(thumb).toHaveAttribute('aria-hidden', 'true');
      expect(thumb.style.transform).toBe('translate(5px, 0px)');
      expect(thumb.style.width).toBe('60px');
      expect(thumb.style.height).toBe('40px');
      expect(thumb).toHaveAttribute('data-animate', 'false');
      expect(group).toHaveAttribute('data-thumb', 'true');
    });

    it('slides to the clicked item and to keyboard selections', async () => {
      mockLayout();
      render(<Single />);
      const group = screen.getByRole('radiogroup');
      await act(() => new Promise((r) => requestAnimationFrame(() => r(undefined))));
      expect(thumbOf(group)).toHaveAttribute('data-animate', 'true');
      await userEvent.click(screen.getByRole('radio', { name: 'List' }));
      expect(thumbOf(group)?.style.transform).toBe('translate(69px, 0px)');
      expect(thumbOf(group)?.style.width).toBe('50px');
      await userEvent.keyboard('{ArrowLeft}');
      await userEvent.keyboard(' ');
      expect(screen.getByRole('radio', { name: 'Grid' })).toHaveAttribute('aria-checked', 'true');
      expect(thumbOf(group)?.style.transform).toBe('translate(5px, 0px)');
      expect(thumbOf(group)?.style.width).toBe('60px');
    });

    it('follows a controlled value and disappears when nothing is selected', () => {
      mockLayout();
      const items = (
        <>
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="masonry">Masonry</ToggleGroupItem>
        </>
      );
      const { rerender } = render(<ToggleGroup type="single" aria-label="Layout" value="grid">{items}</ToggleGroup>);
      const group = screen.getByRole('radiogroup');
      rerender(<ToggleGroup type="single" aria-label="Layout" value="masonry">{items}</ToggleGroup>);
      expect(thumbOf(group)?.style.transform).toBe('translate(123px, 0px)');
      expect(thumbOf(group)?.style.width).toBe('90px');
      rerender(<ToggleGroup type="single" aria-label="Layout" value="">{items}</ToggleGroup>);
      expect(thumbOf(group)).toBeNull();
      expect(group).not.toHaveAttribute('data-thumb');
    });

    it('multiple mode has no shared thumb', () => {
      render(
        <ToggleGroup type="multiple" aria-label="Overlays" defaultValue={['captions']}>
          <ToggleGroupItem value="captions">Captions</ToggleGroupItem>
        </ToggleGroup>,
      );
      expect(screen.getByRole('toolbar').querySelector('.pa-tgroup-thumb')).toBeNull();
    });

    it('forwards the ref to the root', () => {
      const ref = { current: null as HTMLDivElement | null };
      render(
        <ToggleGroup ref={ref} type="single" aria-label="Layout">
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
        </ToggleGroup>,
      );
      expect(ref.current).toBe(screen.getByRole('radiogroup'));
    });
  });
});

describe('ToggleGroup columns', () => {
  it('lays items out n to a row on an even grid', () => {
    render(
      <ToggleGroup type="single" aria-label="Theme" columns={3} defaultValue="a" style={{ marginTop: 4 }}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
        <ToggleGroupItem value="c">C</ToggleGroupItem>
      </ToggleGroup>,
    );
    const group = screen.getByRole('radiogroup', { name: 'Theme' });
    expect(group).toHaveAttribute('data-columns', '3');
    expect(group.style.getPropertyValue('--pa-tgroup-columns')).toBe('3');
    expect(group.style.marginTop).toBe('4px');
  });

  it('keeps the one-line strip when columns is not set', () => {
    render(
      <ToggleGroup type="multiple" aria-label="Format">
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(screen.getByRole('toolbar', { name: 'Format' })).not.toHaveAttribute('data-columns');
  });
});
