import '@/styles/extra/separator.css';
import * as React from 'react';
import { Separator as SeparatorPrimitive } from 'radix-ui';
import { cn } from '@/lib/cn';

export interface SeparatorProps extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  /** `line` is the 1px border rule; `wave` is the cut-paper wave used between page sections (horizontal only). */
  variant?: 'line' | 'wave';
}

/**
 * A 1px rule, horizontal or vertical. `decorative` (default true) hides it from assistive tech;
 * pass `decorative={false}` when it divides content semantically (`role="separator"`).
 */
export const Separator = React.forwardRef<React.ElementRef<typeof SeparatorPrimitive.Root>, SeparatorProps>(
  ({ className, orientation = 'horizontal', decorative = true, variant = 'line', ...props }, ref) => {
    if (variant === 'wave') {
      return (
        <SeparatorPrimitive.Root
          ref={ref}
          orientation="horizontal"
          decorative={decorative}
          className={cn('pa-wave', className)}
          {...props}
        >
          <svg viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path d="M0 6 C 20 2 40 10 60 6 S 100 2 120 6 S 160 10 180 6 S 220 2 240 6 S 280 10 300 6" />
          </svg>
        </SeparatorPrimitive.Root>
      );
    }
    return (
      <SeparatorPrimitive.Root
        ref={ref}
        orientation={orientation}
        decorative={decorative}
        className={cn(orientation === 'vertical' ? 'pa-vr' : 'pa-hr', className)}
        {...props}
      />
    );
  },
);
Separator.displayName = 'Separator';
