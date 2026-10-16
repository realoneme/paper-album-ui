import '@/styles/extra/switch.css';
import * as React from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';
import { cn } from '@/lib/cn';

export type SwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>;

/**
 * An on/off control for settings that apply at once. The knob is drawn by `.pa-switch::after`.
 * Label it with a <Label htmlFor> or `aria-label`.
 */
export const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ className, ...props }, ref) => (
    <SwitchPrimitive.Root ref={ref} className={cn('pa-switch', className)} {...props} />
  ),
);
Switch.displayName = 'Switch';
