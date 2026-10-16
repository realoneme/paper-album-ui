import '@/styles/extra/breadcrumb.css';
import * as React from 'react';
import { Slot } from 'radix-ui';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<'nav'> {
  /** Landmark name; defaults to "Breadcrumb". Use a distinct one when a page has two trails. */
  'aria-label'?: string;
}

/** The trail landmark: `nav aria-label="Breadcrumb"`. */
export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ 'aria-label': ariaLabel = 'Breadcrumb', ...props }, ref) => <nav ref={ref} aria-label={ariaLabel} {...props} />,
);
Breadcrumb.displayName = 'Breadcrumb';

export type BreadcrumbListProps = React.ComponentPropsWithoutRef<'ol'>;

export const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, ...props }, ref) => <ol ref={ref} className={cn('pa-crumb', className)} {...props} />,
);
BreadcrumbList.displayName = 'BreadcrumbList';

export type BreadcrumbItemProps = React.ComponentPropsWithoutRef<'li'>;

export const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn('pa-crumb-item', className)} {...props} />,
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

export interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<'a'> {
  /** Render your router's link component instead of an `<a>`. */
  asChild?: boolean;
}

/** A parent level, muted until hovered. */
export const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : 'a';
    return <Comp ref={ref} className={cn('pa-crumb-link', className)} {...props} />;
  },
);
BreadcrumbLink.displayName = 'BreadcrumbLink';

export type BreadcrumbPageProps = React.ComponentPropsWithoutRef<'span'>;

/** The current page, in bold, with `aria-current="page"`. */
export const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, ...props }, ref) => <span ref={ref} aria-current="page" className={cn('pa-crumb-page', className)} {...props} />,
);
BreadcrumbPage.displayName = 'BreadcrumbPage';

export type BreadcrumbSeparatorProps = React.ComponentPropsWithoutRef<'li'>;

/** Hidden from assistive tech. Defaults to a chevron; pass `/` as children for the slash style. */
export const BreadcrumbSeparator = React.forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  ({ className, children, ...props }, ref) => (
    <li ref={ref} role="presentation" aria-hidden="true" className={cn('sep', className)} {...props}>
      {children ?? <ChevronRight className="pa-i sm" aria-hidden />}
    </li>
  ),
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

export type BreadcrumbEllipsisProps = React.ComponentPropsWithoutRef<'button'>;

/**
 * Collapsed levels: a small secondary key. Wrap it in a DropdownMenuTrigger `asChild`
 * (or handle `onClick`) to reveal the hidden levels.
 */
export const BreadcrumbEllipsis = React.forwardRef<HTMLButtonElement, BreadcrumbEllipsisProps>(
  ({ className, type = 'button', 'aria-label': ariaLabel = 'Show hidden levels', children, ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      className={cn('pa-btn pa-btn-secondary pa-btn-sm pa-crumb-ellipsis', className)}
      {...props}
    >
      {children ?? <span aria-hidden="true">…</span>}
    </button>
  ),
);
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';
