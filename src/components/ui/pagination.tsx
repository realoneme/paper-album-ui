import '@/styles/extra/pagination.css';
import * as React from 'react';
import { Slot } from 'radix-ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface PaginationProps extends React.ComponentPropsWithoutRef<'nav'> {
  /** Landmark name; defaults to "Pagination". */
  'aria-label'?: string;
}

/** The page-links landmark: `nav aria-label="Pagination"`. */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ className, 'aria-label': ariaLabel = 'Pagination', ...props }, ref) => (
    <nav ref={ref} aria-label={ariaLabel} className={cn('pa-pg', className)} {...props} />
  ),
);
Pagination.displayName = 'Pagination';

export type PaginationContentProps = React.ComponentPropsWithoutRef<'ul'>;

export const PaginationContent = React.forwardRef<HTMLUListElement, PaginationContentProps>(
  ({ className, ...props }, ref) => <ul ref={ref} className={cn('pa-pg-list', className)} {...props} />,
);
PaginationContent.displayName = 'PaginationContent';

export type PaginationItemProps = React.ComponentPropsWithoutRef<'li'>;

export const PaginationItem = React.forwardRef<HTMLLIElement, PaginationItemProps>(
  ({ className, ...props }, ref) => <li ref={ref} className={className} {...props} />,
);
PaginationItem.displayName = 'PaginationItem';

export interface PaginationLinkProps extends React.ComponentPropsWithoutRef<'a'> {
  /** The current page: rises as a deep-wood tile and gets `aria-current="page"`. */
  isActive?: boolean;
  /** Mark an edge link (Previous on page 1) as unavailable. */
  disabled?: boolean;
  /** Render your router's link component instead of an `<a>`. */
  asChild?: boolean;
}

/** A 44px page tile. Keep inner text as plain text: `.pa-pg span` styles spans as tiles. */
export const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive = false, disabled = false, asChild = false, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : 'a';
    return (
      <Comp
        ref={ref}
        aria-current={isActive ? 'page' : undefined}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        onClick={disabled ? (e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault() : onClick}
        className={cn('pa-pg-link', className)}
        {...props}
      />
    );
  },
);
PaginationLink.displayName = 'PaginationLink';

export type PaginationPreviousProps = Omit<PaginationLinkProps, 'isActive'>;

export const PaginationPrevious = React.forwardRef<HTMLAnchorElement, PaginationPreviousProps>(
  ({ children = 'Previous', 'aria-label': ariaLabel = 'Go to previous page', ...props }, ref) => (
    <PaginationLink ref={ref} aria-label={ariaLabel} {...props}>
      <ChevronLeft className="pa-i sm" aria-hidden />
      {children}
    </PaginationLink>
  ),
);
PaginationPrevious.displayName = 'PaginationPrevious';

export type PaginationNextProps = Omit<PaginationLinkProps, 'isActive'>;

export const PaginationNext = React.forwardRef<HTMLAnchorElement, PaginationNextProps>(
  ({ children = 'Next', 'aria-label': ariaLabel = 'Go to next page', ...props }, ref) => (
    <PaginationLink ref={ref} aria-label={ariaLabel} {...props}>
      {children}
      <ChevronRight className="pa-i sm" aria-hidden />
    </PaginationLink>
  ),
);
PaginationNext.displayName = 'PaginationNext';

export type PaginationEllipsisProps = React.ComponentPropsWithoutRef<'span'>;

/** Skipped pages; decorative (the numbered links either side carry the meaning). */
export const PaginationEllipsis = React.forwardRef<HTMLSpanElement, PaginationEllipsisProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} aria-hidden="true" className={cn('pa-pg-ellipsis', className)} {...props}>
      …
    </span>
  ),
);
PaginationEllipsis.displayName = 'PaginationEllipsis';
