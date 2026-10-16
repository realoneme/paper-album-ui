import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

describe('Breadcrumb', () => {
  it('renders a labelled nav with an ordered list and the current page', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList className="extra">
          <BreadcrumbItem><BreadcrumbLink href="#home">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Lisbon mornings</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    const list = within(nav).getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(list).toHaveClass('pa-crumb', 'extra');
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '#home');
    expect(screen.getByText('Lisbon mornings')).toHaveAttribute('aria-current', 'page');
    const sep = list.querySelector('.sep');
    expect(sep).toHaveAttribute('aria-hidden', 'true');
    expect(sep?.querySelector('svg.pa-i.sm')).not.toBeNull();
  });

  it('accepts a custom label, slash separators and asChild links', () => {
    render(
      <Breadcrumb aria-label="Breadcrumb, collapsed">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><a href="#x" data-router="yes">Spread 2</a></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(screen.getByRole('navigation', { name: 'Breadcrumb, collapsed' })).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Spread 2' });
    expect(link).toHaveAttribute('data-router', 'yes');
    expect(link).toHaveClass('pa-crumb-link');
    expect(document.querySelector('.sep')).toHaveTextContent('/');
  });

  it('renders the ellipsis as a labelled button', async () => {
    const onClick = vi.fn();
    render(<BreadcrumbEllipsis onClick={onClick} />);
    const btn = screen.getByRole('button', { name: 'Show hidden levels' });
    expect(btn).toHaveAttribute('type', 'button');
    expect(btn).toHaveClass('pa-btn', 'pa-btn-secondary', 'pa-btn-sm');
    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
