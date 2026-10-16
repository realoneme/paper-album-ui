import '@/styles/extra/checkbox.css';
import * as React from 'react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';

export type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>;

/**
 * A sunken square that fills with deep wood when checked. `checked` accepts true, false or
 * 'indeterminate' (rendered as aria-checked="mixed"). Children become the visible label.
 */
export const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, children, ...props }, ref) => (
    <CheckboxPrimitive.Root ref={ref} className={cn('pa-check', className)} {...props}>
      <span className="box">
        <CheckboxPrimitive.Indicator className="pa-check-indicator">
          <Check className="pa-i pa-check-tick" aria-hidden />
          <Minus className="pa-i pa-check-dash" aria-hidden />
        </CheckboxPrimitive.Indicator>
      </span>
      {children}
    </CheckboxPrimitive.Root>
  ),
);
Checkbox.displayName = 'Checkbox';
