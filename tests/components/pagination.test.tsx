import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

function Demo({ onPrev = () => {} }: { onPrev?: () => void }) {
  return (
    <Pagination className="extra">
      <PaginationContent>
        <PaginationItem><PaginationPrevious href="#p" onClick={onPrev} disabled /></PaginationItem>
        <PaginationItem><PaginationLink href="#1">1</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#2" isActive>2</PaginationLink></PaginationItem>
        <PaginationItem><PaginationEllipsis /></PaginationItem>
        <PaginationItem><PaginationLink href="#12">12</PaginationLink></PaginationItem>
        <PaginationItem><PaginationNext href="#p" /></PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

describe('Pagination', () => {
  it('renders a labelled nav with a list of links', () => {
    render(<Demo />);
    const nav = screen.getByRole('navigation', { name: 'Pagination' });
    expect(nav).toHaveClass('pa-pg', 'extra');
    expect(within(nav).getByRole('list')).toHaveClass('pa-pg-list');
    expect(within(nav).getAllByRole('listitem')).toHaveLength(6);
  });

  it('marks only the current page with aria-current', () => {
    render(<Demo />);
    expect(screen.getByRole('link', { name: '2' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: '1' })).not.toHaveAttribute('aria-current');
  });

  it('labels previous/next, hides the ellipsis and blocks disabled links', async () => {
    const onPrev = vi.fn();
    render(<Demo onPrev={onPrev} />);
    const prev = screen.getByRole('link', { name: 'Go to previous page' });
    expect(prev).toHaveTextContent('Previous');
    expect(prev).toHaveAttribute('aria-disabled', 'true');
    expect(prev).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('link', { name: 'Go to next page' })).toHaveTextContent('Next');
    expect(screen.getByText('…')).toHaveAttribute('aria-hidden', 'true');
    prev.click();
    expect(onPrev).not.toHaveBeenCalled();
  });

  it('calls onClick on enabled links', async () => {
    const onClick = vi.fn((e: React.MouseEvent) => e.preventDefault());
    render(<PaginationLink href="#3" onClick={onClick}>3</PaginationLink>);
    await userEvent.click(screen.getByRole('link', { name: '3' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
