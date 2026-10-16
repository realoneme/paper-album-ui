import '@/styles/extra/toggle.css';
import * as React from 'react';
import { Toggle as TogglePrimitive } from 'radix-ui';
import { cn } from '@/lib/cn';

export type ToggleProps = React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>;

/** A two-state button that presses into the paper when on (`pressed` / `defaultPressed`). */
export const Toggle = React.forwardRef<React.ElementRef<typeof TogglePrimitive.Root>, ToggleProps>(
  ({ className, ...props }, ref) => (
    <TogglePrimitive.Root ref={ref} className={cn('pa-toggle', className)} {...props} />
  ),
);
Toggle.displayName = 'Toggle';
