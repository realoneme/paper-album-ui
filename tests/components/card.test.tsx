import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

describe('Card', () => {
  it('renders the slots with their classes', () => {
    render(
      <Card data-testid="card">
        <CardHeader data-testid="header">
          <CardTitle>Winter in Hokkaido</CardTitle>
          <CardDescription>Snow light.</CardDescription>
        </CardHeader>
        <CardContent data-testid="content">Body</CardContent>
        <CardFooter data-testid="footer">Actions</CardFooter>
      </Card>,
    );
    expect(screen.getByTestId('card')).toHaveClass('pa-card');
    expect(screen.getByTestId('card')).not.toHaveClass('stack');
    expect(screen.getByTestId('header')).toHaveClass('pa-card-header');
    expect(screen.getByRole('heading', { level: 3, name: 'Winter in Hokkaido' })).toHaveClass('pa-card-title');
    expect(screen.getByText('Snow light.').tagName).toBe('P');
    expect(screen.getByText('Snow light.')).toHaveClass('pa-card-desc');
    expect(screen.getByTestId('content')).toHaveClass('pa-card-content');
    expect(screen.getByTestId('footer')).toHaveClass('pa-card-footer');
  });

  it('applies the stack variant, merges className and supports asChild', () => {
    render(
      <Card variant="stack" asChild className="extra">
        <article aria-label="Album">x</article>
      </Card>,
    );
    const card = screen.getByRole('article', { name: 'Album' });
    expect(card).toHaveClass('pa-card', 'stack', 'extra');
  });
});
