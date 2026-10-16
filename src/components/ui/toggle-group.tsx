import '@/styles/extra/toggle-group.css';
import * as React from 'react';
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';
import { cn } from '@/lib/cn';

export type ToggleGroupProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>;

/**
 * A segmented strip of toggles. `type="single"` renders a radiogroup (items get `aria-checked`),
 * `type="multiple"` a toolbar (items get `aria-pressed`). Give it an `aria-label`.
 */
export const ToggleGroup = React.forwardRef<React.ElementRef<typeof ToggleGroupPrimitive.Root>, ToggleGroupProps>(
  ({ className, ...props }, ref) => (
    <ToggleGroupPrimitive.Root ref={ref} className={cn('pa-tgroup', className)} {...props} />
  ),
);
ToggleGroup.displayName = 'ToggleGroup';

export type ToggleGroupItemProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>;

/** One segment; the chosen segment rises out of the groove. */
export const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Item ref={ref} className={cn(className)} {...props} />
));
ToggleGroupItem.displayName = 'ToggleGroupItem';
