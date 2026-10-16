import * as React from 'react';
import { cn } from '@/lib/cn';
import { useFieldControl } from '@/components/ui/field';

export type InputGroupProps = React.HTMLAttributes<HTMLDivElement>;

/** An input with a leading icon, addon or text and/or a trailing button, inside one groove. */
export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('pa-igroup', className)} {...props} />,
);
InputGroup.displayName = 'InputGroup';

export type InputGroupInputProps = React.InputHTMLAttributes<HTMLInputElement>;

/** The input inside an InputGroup. Give it an `aria-label` when there is no visible label. */
export const InputGroupInput = React.forwardRef<HTMLInputElement, InputGroupInputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    const controlProps = useFieldControl(props);
    return <input ref={ref} type={type} className={cn(className)} {...controlProps} />;
  },
);
InputGroupInput.displayName = 'InputGroupInput';

export type InputGroupAddonProps = React.HTMLAttributes<HTMLSpanElement>;

/** A fixed prefix on a darker strip, such as a domain. */
export const InputGroupAddon = React.forwardRef<HTMLSpanElement, InputGroupAddonProps>(
  ({ className, ...props }, ref) => <span ref={ref} className={cn('addon', className)} {...props} />,
);
InputGroupAddon.displayName = 'InputGroupAddon';

export type InputGroupTextProps = React.HTMLAttributes<HTMLSpanElement>;

/** Plain inline text in the groove, such as a currency symbol. */
export const InputGroupText = React.forwardRef<HTMLSpanElement, InputGroupTextProps>(
  ({ className, ...props }, ref) => <span ref={ref} className={cn(className)} {...props} />,
);
InputGroupText.displayName = 'InputGroupText';
