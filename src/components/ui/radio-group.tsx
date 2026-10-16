import '@/styles/extra/radio-group.css';
import * as React from 'react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import { cn } from '@/lib/cn';

export type RadioGroupProps = React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>;

/** Mutually exclusive options as paper slips. Give it an `aria-label` or `aria-labelledby`. */
export const RadioGroup = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Root>, RadioGroupProps>(
  ({ className, ...props }, ref) => (
    <RadioGroupPrimitive.Root ref={ref} className={cn('pa-stack pa-radio-group', className)} {...props} />
  ),
);
RadioGroup.displayName = 'RadioGroup';

export type RadioGroupItemProps = React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>;

/** One slip; the chosen slip is raised. Children are the title and meta line. */
export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, children, ...props }, ref) => (
  <RadioGroupPrimitive.Item ref={ref} className={cn('pa-radio', className)} {...props}>
    <span className="dot" aria-hidden="true" />
    {children}
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = 'RadioGroupItem';
