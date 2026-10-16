import '@/styles/extra/aspect-ratio.css';
import * as React from 'react';
import { AspectRatio as AspectRatioPrimitive } from 'radix-ui';
import { cn } from '@/lib/cn';

export type AspectRatioProps = React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>;

/** A fixed-ratio frame (16/9, 3/2, 1, 4/5) that crops its image to fill. */
export const AspectRatio = React.forwardRef<React.ElementRef<typeof AspectRatioPrimitive.Root>, AspectRatioProps>(
  ({ className, ...props }, ref) => (
    <AspectRatioPrimitive.Root ref={ref} className={cn('pa-ratio', className)} {...props} />
  ),
);
AspectRatio.displayName = 'AspectRatio';
