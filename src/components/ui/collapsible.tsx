import '@/styles/extra/collapsible.css';
import * as React from 'react';
import { Collapsible as CollapsiblePrimitive } from 'radix-ui';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export type CollapsibleProps = React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>;

/** One raised block that opens and closes. Controlled with `open`/`onOpenChange` or `defaultOpen`. */
export const Collapsible = React.forwardRef<React.ElementRef<typeof CollapsiblePrimitive.Root>, CollapsibleProps>(
  ({ className, ...props }, ref) => <CollapsiblePrimitive.Root ref={ref} className={cn('pa-collapsible', className)} {...props} />,
);
Collapsible.displayName = 'Collapsible';

export interface CollapsibleTriggerProps extends React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger> {
  /** Optional leading Lucide icon, shown before the label. */
  icon?: React.ReactNode;
}

/**
 * Full-width trigger with a turning chevron; Radix sets `aria-expanded`.
 * With `asChild`, your element is rendered as-is (no chevron is added).
 */
export const CollapsibleTrigger = React.forwardRef<React.ElementRef<typeof CollapsiblePrimitive.Trigger>, CollapsibleTriggerProps>(
  ({ className, children, icon, asChild, ...props }, ref) =>
    asChild ? (
      <CollapsiblePrimitive.Trigger ref={ref} asChild className={className} {...props}>
        {children}
      </CollapsiblePrimitive.Trigger>
    ) : (
      <CollapsiblePrimitive.Trigger ref={ref} className={cn('pa-acc-trigger', className)} {...props}>
        <span className="pa-collapsible-label">
          {icon}
          {children}
        </span>
        <ChevronDown className="pa-i" aria-hidden />
      </CollapsiblePrimitive.Trigger>
    ),
);
CollapsibleTrigger.displayName = 'CollapsibleTrigger';

export type CollapsibleContentProps = React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>;

/** The optional detail; by default a two-column grid of `.cell` tiles. */
export const CollapsibleContent = React.forwardRef<React.ElementRef<typeof CollapsiblePrimitive.Content>, CollapsibleContentProps>(
  ({ className, ...props }, ref) => <CollapsiblePrimitive.Content ref={ref} className={cn('body', className)} {...props} />,
);
CollapsibleContent.displayName = 'CollapsibleContent';
