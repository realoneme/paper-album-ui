import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
