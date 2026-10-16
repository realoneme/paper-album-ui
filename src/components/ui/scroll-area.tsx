import '@/styles/extra/scroll-area.css';
import * as React from 'react';
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';
import { cn } from '@/lib/cn';

export interface ScrollAreaProps extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  /**
   * Accessible name for the scrolling region. When set, the viewport becomes a focusable
   * `role="region"` so keyboard users can scroll it with the arrow keys.
   */
  label?: string;
  /** Show a horizontal scrollbar as well as the vertical one. */
  horizontal?: boolean;
  /** Props for the inner viewport element. */
  viewportProps?: React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Viewport>;
}

/** A fixed-height region (180px by default; override with `className`/`style`) with a sunken groove and wood thumb. */
export const ScrollArea = React.forwardRef<React.ElementRef<typeof ScrollAreaPrimitive.Root>, ScrollAreaProps>(
  ({ className, children, label, horizontal = false, viewportProps, ...props }, ref) => (
    <ScrollAreaPrimitive.Root ref={ref} className={cn('pa-scroll-area', className)} {...props}>
      <ScrollAreaPrimitive.Viewport
        {...viewportProps}
        className={cn('pa-scroll-viewport', viewportProps?.className)}
        {...(label ? { role: 'region', 'aria-label': label, tabIndex: 0 } : {})}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      {horizontal ? <ScrollBar orientation="horizontal" /> : null}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  ),
);
ScrollArea.displayName = 'ScrollArea';

export type ScrollBarProps = React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar>;

/** The sunken groove with its wood thumb. */
export const ScrollBar = React.forwardRef<React.ElementRef<typeof ScrollAreaPrimitive.Scrollbar>, ScrollBarProps>(
  ({ className, orientation = 'vertical', ...props }, ref) => (
    <ScrollAreaPrimitive.Scrollbar ref={ref} orientation={orientation} className={cn('pa-scrollbar', className)} {...props}>
      <ScrollAreaPrimitive.Thumb className="pa-scroll-thumb" />
    </ScrollAreaPrimitive.Scrollbar>
  ),
);
ScrollBar.displayName = 'ScrollBar';
