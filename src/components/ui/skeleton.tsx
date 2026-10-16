import * as React from 'react';
import { cn } from '@/lib/cn';

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * A shimmering paper placeholder. Size it like the content it stands in for, and wrap the group
 * in an element with `role="status"` and an `aria-label` such as "Loading album".
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(({ className, ...props }, ref) => (
  <div ref={ref} aria-hidden className={cn('pa-skel', className)} {...props} />
));
Skeleton.displayName = 'Skeleton';
