import * as React from 'react';
import { cn } from '@/lib/cn';
import { useFieldControl } from '@/components/ui/field';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/** A single-line text groove. Inside a Field it picks up id, description and invalid state. */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    const controlProps = useFieldControl(props);
    return <input ref={ref} type={type} className={cn('pa-input', className)} {...controlProps} />;
  },
);
Input.displayName = 'Input';
