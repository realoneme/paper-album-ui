import '@/styles/extra/slider.css';
import * as React from 'react';
import { Slider as SliderPrimitive } from 'radix-ui';
import { cn } from '@/lib/cn';

export interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /** Accessible names per thumb. Defaults to `aria-label` (one thumb) or "<aria-label>, minimum/maximum" (range). */
  thumbLabels?: string[];
  /** Human-readable value for screen readers, for example `(v) => \`$${v}\``. */
  formatValueText?: (value: number) => string;
}

/**
 * Pick a value or a range along a sunken track; the filled part is wood.
 * Pass one value for a single thumb, two for a range. Arrow keys, Page Up/Down, Home and End work.
 */
export const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  (
    {
      className,
      value,
      defaultValue,
      min = 0,
      max = 100,
      thumbLabels,
      formatValueText,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      ...props
    },
    ref,
  ) => {
    const values = value ?? defaultValue ?? [min];
    const count = values.length;
    const labelFor = (i: number) => {
      if (thumbLabels?.[i]) return thumbLabels[i];
      if (!ariaLabel) return undefined;
      if (count === 1) return ariaLabel;
      if (count === 2) return `${ariaLabel}, ${i === 0 ? 'minimum' : 'maximum'}`;
      return `${ariaLabel}, ${i + 1} of ${count}`;
    };
    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn('pa-slider', className)}
        value={value}
        defaultValue={defaultValue}
        min={min}
        max={max}
        {...props}
      >
        <SliderPrimitive.Track className="track">
          <SliderPrimitive.Range className="range" />
        </SliderPrimitive.Track>
        {values.map((v, i) => (
          <SliderPrimitive.Thumb
            key={i}
            className="thumb"
            aria-label={labelFor(i)}
            aria-labelledby={labelFor(i) ? undefined : ariaLabelledby}
            aria-valuetext={formatValueText ? formatValueText(v) : undefined}
          />
        ))}
      </SliderPrimitive.Root>
    );
  },
);
Slider.displayName = 'Slider';
