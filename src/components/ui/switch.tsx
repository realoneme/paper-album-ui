import '@/styles/extra/switch.css';
import * as React from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';
import { cn } from '@/lib/cn';

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  /** Track size: `sm` 36×20 (dense rows, tables), `default` 44×24, `lg` 64×36 (a single prominent setting). */
  size?: 'sm' | 'default' | 'lg';
}

/**
 * An on/off control for settings that apply at once. The knob is drawn by `.pa-switch::after`; every size keeps
 * a tap target at least 44px tall.
 * Label it with a <Label htmlFor> or `aria-label`.
 */
export const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ className, size = 'default', ...props }, ref) => (
    <SwitchPrimitive.Root ref={ref} className={cn('pa-switch', size !== 'default' && size, className)} {...props} />
  ),
);
Switch.displayName = 'Switch';
