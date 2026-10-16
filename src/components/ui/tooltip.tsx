import '@/styles/extra/tooltip.css';
import * as React from 'react';
import { Tooltip as TooltipPrimitive } from 'radix-ui';
import { cn } from '@/lib/cn';

export type TooltipProviderProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>;

/** Shares open/close delays between tooltips. Tooltip already wraps itself in one. */
export function TooltipProvider({ delayDuration = 300, ...props }: TooltipProviderProps) {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
}
TooltipProvider.displayName = 'TooltipProvider';

export type TooltipProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>;

/** A short deep-wood label for an icon-only button. One short phrase, no punctuation. */
export function Tooltip(props: TooltipProps) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root {...props} />
    </TooltipProvider>
  );
}
Tooltip.displayName = 'Tooltip';

export const TooltipTrigger = TooltipPrimitive.Trigger;

export type TooltipPortalContainer = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Portal>['container'];

export interface TooltipContentProps extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  /** Portal target (defaults to document.body). */
  container?: TooltipPortalContainer;
}

/** The label. Radix links it to the trigger with aria-describedby. */
export const TooltipContent = React.forwardRef<React.ElementRef<typeof TooltipPrimitive.Content>, TooltipContentProps>(
  ({ className, container, sideOffset = 10, ...props }, ref) => (
    <TooltipPrimitive.Portal container={container}>
      <TooltipPrimitive.Content ref={ref} sideOffset={sideOffset} className={cn('pa-tooltip', className)} {...props} />
    </TooltipPrimitive.Portal>
  ),
);
TooltipContent.displayName = 'TooltipContent';
