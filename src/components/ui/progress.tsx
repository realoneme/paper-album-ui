import '@/styles/extra/progress.css';
import * as React from 'react';
import { Progress as ProgressPrimitive } from 'radix-ui';
import { cn } from '@/lib/cn';

export interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** Force the finished (success) look; by default it turns on when `value >= max`. */
  done?: boolean;
}

/**
 * A filling groove for progress (uploads, exports). The fill glides to each new value and a soft light
 * sweeps across it while running; at `max` it settles into the success tone. Leave `value` empty
 * (`null`/`undefined`) for indeterminate work: a glowing segment travels back and forth.
 * Name it with `aria-label` or `aria-labelledby`, and show the percentage in text too.
 */
export const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value, max = 100, done, ...props }, ref) => {
    const known = typeof value === 'number';
    const pct = known ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
    const finished = done ?? (known && value >= max);
    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn('pa-progress', finished && 'done', !known && 'indeterminate', className)}
        value={value}
        max={max}
        {...props}
      >
        <ProgressPrimitive.Indicator asChild>
          <span className="pa-progress-fill" style={known ? { width: `${pct}%` } : undefined}>
            {finished ? null : <span className="pa-progress-glow" aria-hidden />}
          </span>
        </ProgressPrimitive.Indicator>
      </ProgressPrimitive.Root>
    );
  },
);
Progress.displayName = 'Progress';
