import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import EmptyDemo from '@/docs/demos/Empty.demo';

describe('Empty', () => {
  it('demo shows pocket, title, line and one action', () => {
    const { container } = render(<EmptyDemo />);
    expect(container.querySelector('.pa-empty')).not.toBeNull();
    expect(container.querySelector('.pa-empty-pocket')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('heading', { level: 3, name: 'No photos yet' })).toHaveClass('pa-empty-title');
    expect(screen.getByText('Drop images here to fill this album.')).toHaveClass('pa-caption');
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Upload photos' })).toBeInTheDocument();
  });

  it('merges classes, sets heading level and accepts custom media', () => {
    const { container } = render(
      <Empty className="mine">
        <EmptyMedia className="art"><svg /></EmptyMedia>
        <EmptyTitle as="h2">Nothing found</EmptyTitle>
        <EmptyDescription className="desc">Try another word.</EmptyDescription>
      </Empty>,
    );
    expect(container.firstElementChild).toHaveClass('pa-empty', 'mine');
    const media = container.querySelector('.art');
    expect(media).not.toHaveClass('pa-empty-pocket');
    expect(screen.getByRole('heading', { level: 2, name: 'Nothing found' })).toBeInTheDocument();
    expect(screen.getByText('Try another word.')).toHaveClass('pa-caption', 'desc');
  });
});
