import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  TypographyBlockquote,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyInlineCode,
  TypographyLead,
  TypographyList,
  TypographyMuted,
  TypographyNote,
  TypographyP,
} from '@/components/ui/typography';

describe('Typography', () => {
  it('renders headings at the right levels with their classes', () => {
    render(
      <>
        <TypographyH1 className="mine">One</TypographyH1>
        <TypographyH2>Two</TypographyH2>
        <TypographyH3>Three</TypographyH3>
        <TypographyH4>Four</TypographyH4>
      </>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'One' })).toHaveClass('pa-h1', 'mine');
    expect(screen.getByRole('heading', { level: 2, name: 'Two' })).toHaveClass('pa-h2');
    expect(screen.getByRole('heading', { level: 3, name: 'Three' })).toHaveClass('pa-h3');
    expect(screen.getByRole('heading', { level: 4, name: 'Four' })).toHaveClass('pa-h4');
  });

  it('renders body styles with semantic elements', () => {
    render(
      <>
        <TypographyLead>Lead</TypographyLead>
        <TypographyP>
          Body <TypographyInlineCode>310gsm</TypographyInlineCode>
        </TypographyP>
        <TypographyBlockquote>Quote</TypographyBlockquote>
        <TypographyList>
          <li>Item</li>
        </TypographyList>
        <TypographyMuted>Muted</TypographyMuted>
        <TypographyNote>Lisbon, early light</TypographyNote>
      </>,
    );
    expect(screen.getByText('Lead')).toHaveClass('pa-lead');
    expect(screen.getByText('310gsm').tagName).toBe('CODE');
    expect(screen.getByText('310gsm')).toHaveClass('pa-code');
    expect(screen.getByText('Quote').tagName).toBe('BLOCKQUOTE');
    expect(screen.getByText('Quote')).toHaveClass('pa-quote');
    expect(screen.getByRole('list')).toHaveClass('pa-list');
    expect(screen.getByText('Muted')).toHaveClass('pa-caption');
    expect(screen.getByText('Lisbon, early light')).toHaveClass('pa-note');
    expect(screen.getByText(/Body/).tagName).toBe('P');
  });
});
