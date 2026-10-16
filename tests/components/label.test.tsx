import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Label } from '@/components/ui/label';

describe('Label', () => {
  it('names its control via htmlFor and merges className', () => {
    render(
      <>
        <Label htmlFor="title" className="extra">Album title</Label>
        <input id="title" />
      </>,
    );
    const label = screen.getByText('Album title');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveClass('pa-label', 'extra');
    expect(screen.getByRole('textbox', { name: 'Album title' })).toBeInTheDocument();
  });

  it('focuses the control when clicked', async () => {
    render(
      <>
        <Label htmlFor="t2">Message</Label>
        <input id="t2" />
      </>,
    );
    await userEvent.click(screen.getByText('Message'));
    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveFocus();
  });

  it('labels a wrapped control', () => {
    render(<Label>Email <input type="email" /></Label>);
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
  });
});
