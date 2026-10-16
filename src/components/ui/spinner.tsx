import '@/styles/extra/spinner.css';
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const spinnerVariants = cva('pa-spinner', {
  variants: {
    /** `wood` on a muted track; `primary` arc; `current` follows text colour (inside buttons). */
    tone: { wood: '', primary: 'primary', current: 'current' },
    size: { sm: 'sm', default: '', lg: 'lg' },
  },
  defaultVariants: { tone: 'wood', size: 'default' },
});

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement>, VariantProps<typeof spinnerVariants> {
  /** Accessible name. Ignored when `aria-hidden` (e.g. inside a button whose label says what is happening). */
  label?: string;
}

/** A turning paper band for unknown waits. */
export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, tone, size, label = 'Loading', ...props }, ref) => {
    const hidden = props['aria-hidden'] === true || props['aria-hidden'] === 'true';
    return (
      <svg
        ref={ref}
        viewBox="0 0 40 40"
        className={cn(spinnerVariants({ tone, size }), className)}
        role={hidden ? undefined : 'img'}
        aria-label={hidden ? undefined : label}
        {...props}
      >
        <circle className="pa-spinner-track" cx="20" cy="20" r="15" fill="none" strokeWidth="6" />
        <circle
          className="pa-spinner-arc"
          cx="20"
          cy="20"
          r="15"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="30 70"
        />
      </svg>
    );
  },
);
Spinner.displayName = 'Spinner';
