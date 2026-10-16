import { useState, type MouseEvent } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Pagination', group: 'Layout & navigation', height: 90 };

const TOTAL = 12;

/** Pages to show: first, last, and the current page with its neighbours. */
function visiblePages(current: number): (number | 'gap')[] {
  const set = new Set([1, TOTAL, current - 1, current, current + 1].filter((p) => p >= 1 && p <= TOTAL));
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | 'gap')[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('gap');
    out.push(p);
  });
  return out;
}

export default function PaginationDemo() {
  const [page, setPage] = useState(2);
  const go = (p: number) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setPage(Math.max(1, Math.min(TOTAL, p)));
  };
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem><PaginationPrevious href="#p" onClick={go(page - 1)} disabled={page === 1} /></PaginationItem>
        {visiblePages(page).map((p, i) =>
          p === 'gap' ? (
            <PaginationItem key={`gap-${i}`}><PaginationEllipsis /></PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink href="#p" isActive={p === page} onClick={go(p)}>{p}</PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem><PaginationNext href="#p" onClick={go(page + 1)} disabled={page === TOTAL} /></PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
