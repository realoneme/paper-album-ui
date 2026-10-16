import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from '@/components/ui/avatar';

describe('Avatar', () => {
  it('shows the initials fallback when the image has not loaded', () => {
    render(
      <Avatar role="img" aria-label="Diego Ruiz">
        <AvatarImage src="/diego.jpg" alt="" />
        <AvatarFallback>DR</AvatarFallback>
      </Avatar>,
    );
    const avatar = screen.getByRole('img', { name: 'Diego Ruiz' });
    expect(avatar).toHaveClass('pa-avatar');
    expect(avatar).toHaveTextContent('DR');
    // jsdom never loads images, so radix keeps the <img> out of the tree.
    expect(avatar.querySelector('img')).toBeNull();
  });

  it('applies size and tone classes and merges className', () => {
    const { rerender } = render(<Avatar data-testid="a" size="sm" tone="deep" className="extra" />);
    expect(screen.getByTestId('a')).toHaveClass('pa-avatar', 'sm', 'deep', 'extra');
    rerender(<Avatar data-testid="a" size="lg" />);
    expect(screen.getByTestId('a')).toHaveClass('lg');
    expect(screen.getByTestId('a')).not.toHaveClass('deep');
    rerender(<Avatar data-testid="a" size="xs" />);
    expect(screen.getByTestId('a')).toHaveClass('xs');
  });

  it('groups avatars with an accessible label and a count disc', () => {
    render(
      <AvatarGroup aria-label="Collaborators">
        <Avatar>
          <AvatarFallback>HS</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+4</AvatarGroupCount>
      </AvatarGroup>,
    );
    const group = screen.getByRole('group', { name: 'Collaborators' });
    expect(group).toHaveClass('pa-avatar-group');
    expect(screen.getByText('+4')).toHaveClass('pa-avatar', 'count');
  });
});
