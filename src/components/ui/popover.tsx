import '@/styles/extra/popover.css';
import * as React from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { cn } from '@/lib/cn';

/** A small top sheet opened by a click, with a pointer to its trigger. One short task per popover. */
export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;

export type PopoverProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>;
export type PopoverPortalContainer = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Portal>['container'];

export interface PopoverContentProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  /** Portal target (defaults to document.body). */
  container?: PopoverPortalContainer;
}

/** The sheet. Aligned to the trigger's start edge so the pointer sits under it. Give it an aria-label or a heading. */
export const PopoverContent = React.forwardRef<React.ElementRef<typeof PopoverPrimitive.Content>, PopoverContentProps>(
  ({ className, container, align = 'start', sideOffset = 12, ...props }, ref) => (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn('pa-pop pa-arrow-up pa-popover', className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  ),
);
PopoverContent.displayName = 'PopoverContent';
