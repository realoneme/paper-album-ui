import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Kbd, KbdGroup } from '@/components/ui/kbd';

describe('Kbd', () => {
  it('renders keycaps inside a group', () => {
    render(
      <KbdGroup data-testid="group" className="mine">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>,
    );
    const group = screen.getByTestId('group');
    expect(group.tagName).toBe('KBD');
    expect(group).toHaveClass('pa-kbd-group', 'mine');
    const key = screen.getByText('K');
    expect(key.tagName).toBe('KBD');
    expect(key).toHaveClass('pa-kbd');
    expect(group).toHaveTextContent('⌘K');
  });
});
