import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const buttonGroupVariants = cva('pa-bgroup', {
  variants: {
    variant: { default: '', primary: 'primary' },
  },
  defaultVariants: { variant: 'default' },
});

export interface ButtonGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> {}

/** Related buttons sharing one paper edge: a pager or a split button. Give it an `aria-label`. */
export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, variant, role = 'group', ...props }, ref) => (
    <div ref={ref} role={role} className={cn(buttonGroupVariants({ variant }), className)} {...props} />
  ),
);
ButtonGroup.displayName = 'ButtonGroup';

export type ButtonGroupTextProps = React.HTMLAttributes<HTMLSpanElement>;

/** A non-interactive text segment inside a ButtonGroup, such as "3 / 24". */
export const ButtonGroupText = React.forwardRef<HTMLSpanElement, ButtonGroupTextProps>(
  ({ className, ...props }, ref) => <span ref={ref} className={cn('pa-bgroup-text', className)} {...props} />,
);
ButtonGroupText.displayName = 'ButtonGroupText';
