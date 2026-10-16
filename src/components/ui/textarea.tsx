import '@/styles/extra/textarea.css';
import * as React from 'react';
import { cn } from '@/lib/cn';
import { useFieldControl } from '@/components/ui/field';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

/** A multi-line groove, 96px minimum height, resizes vertically. */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const controlProps = useFieldControl(props);
    return <textarea ref={ref} className={cn('pa-textarea', className)} {...controlProps} />;
  },
);
Textarea.displayName = 'Textarea';
