import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group';

describe('ButtonGroup', () => {
  it('renders a labelled group with paper classes', () => {
    render(
      <ButtonGroup aria-label="Photo pager" className="extra">
        <Button aria-label="Previous photo">‹</Button>
        <ButtonGroupText>3 / 24</ButtonGroupText>
        <Button aria-label="Next photo">›</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole('group', { name: 'Photo pager' });
    expect(group).toHaveClass('pa-bgroup', 'extra');
    expect(group).not.toHaveClass('primary');
    expect(screen.getByText('3 / 24')).toHaveClass('pa-bgroup-text');
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('applies the primary variant', () => {
    render(<ButtonGroup variant="primary" aria-label="Download"><Button>Download originals</Button></ButtonGroup>);
    expect(screen.getByRole('group', { name: 'Download' })).toHaveClass('pa-bgroup', 'primary');
  });

  it('keeps child buttons interactive and respects disabled', async () => {
    const onNext = vi.fn();
    const onPrev = vi.fn();
    render(
      <ButtonGroup aria-label="Pager">
        <Button aria-label="Previous photo" disabled onClick={onPrev}>‹</Button>
        <Button aria-label="Next photo" onClick={onNext}>›</Button>
      </ButtonGroup>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Next photo' }));
    await userEvent.click(screen.getByRole('button', { name: 'Previous photo' }));
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onPrev).not.toHaveBeenCalled();
  });
});
