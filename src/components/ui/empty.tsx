import '@/styles/extra/empty.css';
import * as React from 'react';
import { cn } from '@/lib/cn';

export type EmptyProps = React.HTMLAttributes<HTMLDivElement>;

/** What an empty album, search or list shows: an empty pocket, a title, one line, one action. */
export const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pa-empty', className)} {...props} />
));
Empty.displayName = 'Empty';

export type EmptyMediaProps = React.HTMLAttributes<HTMLDivElement>;

/** The empty photo pocket. Decorative; pass children to replace it with your own art. */
export const EmptyMedia = React.forwardRef<HTMLDivElement, EmptyMediaProps>(({ className, children, ...props }, ref) => (
  <div ref={ref} aria-hidden className={cn(!children && 'pa-empty-pocket', className)} {...props}>
    {children}
  </div>
));
EmptyMedia.displayName = 'EmptyMedia';

export interface EmptyTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading level that fits the page outline. */
  as?: 'h2' | 'h3' | 'h4' | 'p';
}

export const EmptyTitle = React.forwardRef<HTMLHeadingElement, EmptyTitleProps>(
  ({ className, as: Comp = 'h3', ...props }, ref) => <Comp ref={ref} className={cn('pa-empty-title', className)} {...props} />,
);
EmptyTitle.displayName = 'EmptyTitle';

export type EmptyDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export const EmptyDescription = React.forwardRef<HTMLParagraphElement, EmptyDescriptionProps>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn('pa-caption', className)} {...props} />,
);
EmptyDescription.displayName = 'EmptyDescription';

export type EmptyContentProps = React.HTMLAttributes<HTMLDivElement>;

/** Holds the one primary action. */
export const EmptyContent = React.forwardRef<HTMLDivElement, EmptyContentProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pa-empty-content', className)} {...props} />
));
EmptyContent.displayName = 'EmptyContent';
