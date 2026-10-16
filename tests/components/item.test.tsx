import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

describe('Item', () => {
  it('renders media, content and actions', () => {
    render(
      <Item data-testid="item" className="mine">
        <ItemMedia data-testid="media" className="ph-2" />
        <ItemContent data-testid="body">
          <ItemTitle>Lisbon Mornings</ItemTitle>
          <ItemDescription>18 photos</ItemDescription>
        </ItemContent>
        <ItemActions>
          <button type="button">Open</button>
        </ItemActions>
      </Item>,
    );
    expect(screen.getByTestId('item')).toHaveClass('pa-item', 'mine');
    expect(screen.getByTestId('item')).not.toHaveClass('dashed');
    expect(screen.getByTestId('media')).toHaveClass('pa-item-media', 'ph-2');
    expect(screen.getByTestId('body')).toHaveClass('pa-item-body');
    expect(screen.getByText('Lisbon Mornings')).toHaveClass('pa-item-title');
    expect(screen.getByText('18 photos')).toHaveClass('pa-item-desc');
    expect(screen.getByRole('button', { name: 'Open' }).parentElement).toHaveClass('pa-item-actions');
  });

  it('supports the dashed variant, icon media and asChild links', () => {
    render(
      <Item variant="dashed" asChild>
        <a href="#new">
          <ItemMedia variant="icon" data-testid="media" />
          New album
        </a>
      </Item>,
    );
    expect(screen.getByRole('link', { name: 'New album' })).toHaveClass('pa-item', 'dashed');
    expect(screen.getByTestId('media')).toHaveClass('pa-item-media', 'icon');
  });
});
