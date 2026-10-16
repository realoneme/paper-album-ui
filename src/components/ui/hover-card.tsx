import '@/styles/extra/hover-card.css';
import * as React from 'react';
import { HoverCard as HoverCardPrimitive } from 'radix-ui';
import { cn } from '@/lib/cn';

/** A preview while hovering or focusing a link. Never the only copy of the information. */
export const HoverCard = HoverCardPrimitive.Root;
export const HoverCardTrigger = HoverCardPrimitive.Trigger;

export type HoverCardProps = React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Root>;
export type HoverCardPortalContainer = React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Portal>['container'];

export interface HoverCardContentProps extends React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content> {
  /** Portal target (defaults to document.body). */
  container?: HoverCardPortalContainer;
}

/** The preview sheet: typically an avatar and two lines of text. */
export const HoverCardContent = React.forwardRef<React.ElementRef<typeof HoverCardPrimitive.Content>, HoverCardContentProps>(
  ({ className, container, align = 'start', sideOffset = 10, ...props }, ref) => (
    <HoverCardPrimitive.Portal container={container}>
      <HoverCardPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn('pa-pop pa-hovercard', className)}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  ),
);
HoverCardContent.displayName = 'HoverCardContent';
