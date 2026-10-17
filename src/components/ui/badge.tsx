import '@/styles/extra/badge.css';
import * as React from 'react';
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const badgeVariants = cva('pa-badge', {
  variants: {
    variant: {
      default: 'pa-badge-default',
      secondary: 'pa-badge-secondary',
      outline: 'pa-badge-outline',
      destructive: 'pa-badge-destructive',
      seal: 'pa-badge-seal',
      wood: 'pa-badge-wood',
      success: 'pa-badge-success',
      warning: 'pa-badge-warning',
      info: 'pa-badge-info',
    },
    /** `default` 28px, `sm` 22px (12px text and icons), `xs` 18px slim pill (11px text, 10px icons). */
    size: {
      default: '',
      sm: 'pa-badge-sm',
      xs: 'pa-badge-xs',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  /** Render the child element (for example a link) with badge styling. */
  asChild?: boolean;
}

/**
 * A pill for status or category; one or two words. For semantic tones add an icon so the status
 * is not carried by colour alone.
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : 'span';
    return <Comp ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props} />;
  },
);
Badge.displayName = 'Badge';
