import '@/styles/extra/accordion.css';
import * as React from 'react';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export type AccordionProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>;

/** Stacked questions. `type="single"` (with `collapsible`) opens one at a time; `type="multiple"` allows several. */
export const Accordion = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Root>, AccordionProps>(
  ({ className, ...props }, ref) => <AccordionPrimitive.Root ref={ref} className={cn('pa-acc', className)} {...props} />,
);
Accordion.displayName = 'Accordion';

export type AccordionItemProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>;

export const AccordionItem = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Item>, AccordionItemProps>(
  ({ className, ...props }, ref) => <AccordionPrimitive.Item ref={ref} className={cn('pa-acc-item', className)} {...props} />,
);
AccordionItem.displayName = 'AccordionItem';

export type AccordionTriggerProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>;

/** The question: a full-width button inside an `h3`; Radix sets `aria-expanded`, which turns the chevron. */
export const AccordionTrigger = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Trigger>, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header className="pa-acc-header">
      <AccordionPrimitive.Trigger ref={ref} className={cn('pa-acc-trigger', className)} {...props}>
        {children}
        <ChevronDown className="pa-i" aria-hidden />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  ),
);
AccordionTrigger.displayName = 'AccordionTrigger';

export type AccordionContentProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>;

/** The answer, shown in a sunken well (`role="region"`, labelled by its trigger). */
export const AccordionContent = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Content>, AccordionContentProps>(
  ({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content ref={ref} className="pa-acc-content" {...props}>
      <div className={cn('pa-acc-panel', className)}>{children}</div>
    </AccordionPrimitive.Content>
  ),
);
AccordionContent.displayName = 'AccordionContent';
