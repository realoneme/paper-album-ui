import '@/styles/extra/spinner.css';
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const spinnerVariants = cva('pa-spinner pa-spinner-goo', {
  variants: {
    /** `wood` (default), `primary`, or `current` to follow the text colour (inside buttons). */
    tone: { wood: '', primary: 'primary', current: 'current' },
    size: { sm: 'sm', default: '', lg: 'lg' },
  },
  defaultVariants: { tone: 'wood', size: 'default' },
});

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement>, VariantProps<typeof spinnerVariants> {
  /** Accessible name. Ignored when `aria-hidden` (e.g. inside a button whose label says what is happening). */
  label?: string;
}

/** Orbit radius and the comet: a lead ball, then a tail of smaller balls, each a little further behind. */
const ORBIT = 12;
const TAIL = [5, 4.4, 3.8, 3.2, 2.7, 2.2, 1.7] as const;
const STEP_DEG = 15;
const STEP_DELAY_S = 0.045;

/**
 * A gooey comet for unknown waits: a lead ball circles, a tail of shrinking balls follows, and an SVG
 * goo filter (blur, then an alpha threshold) melts them into one liquid drop.
 */
export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, tone, size, label = 'Loading', ...props }, ref) => {
    const hidden = props['aria-hidden'] === true || props['aria-hidden'] === 'true';
    const filterId = `pa-goo-${React.useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
    return (
      <svg
        ref={ref}
        viewBox="0 0 40 40"
        className={cn(spinnerVariants({ tone, size }), className)}
        role={hidden ? undefined : 'status'}
        aria-label={hidden ? undefined : label}
        {...props}
      >
        <defs>
          <filter id={filterId} x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" />
          </filter>
        </defs>
        <g filter={`url(#${filterId})`}>
          {TAIL.map((r, i) => (
            <g key={i} className="pa-spinner-orbit" style={{ animationDelay: `${i * STEP_DELAY_S}s` }}>
              <circle className="pa-spinner-ball" cx="20" cy={20 - ORBIT} r={r} transform={`rotate(${-i * STEP_DEG} 20 20)`} />
            </g>
          ))}
        </g>
      </svg>
    );
  },
);
Spinner.displayName = 'Spinner';
