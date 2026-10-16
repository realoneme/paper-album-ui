import * as React from 'react';
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const buttonVariants = cva('pa-btn', {
  variants: {
    variant: {
      default: 'pa-btn-default',
      secondary: 'pa-btn-secondary',
      outline: 'pa-btn-outline',
      ghost: 'pa-btn-ghost',
      link: 'pa-btn-link',
      destructive: 'pa-btn-destructive',
      seal: 'pa-btn-seal',
    },
    size: { default: '', sm: 'pa-btn-sm', lg: 'pa-btn-lg', icon: 'pa-btn-icon' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render the child element (for example a link) with button styling instead of a <button>. */
  asChild?: boolean;
}

/** A paper key. `default` is the one primary action per view. */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        type={asChild ? undefined : (type ?? 'button')}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
