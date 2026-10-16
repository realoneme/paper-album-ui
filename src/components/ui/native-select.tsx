import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Class for the `pa-select-wrap` wrapper that holds the select and its chevron. */
  wrapperClassName?: string;
}

/** The browser's own select, restyled as a groove with a chevron. Prefer it on phones and for long lists. */
export const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, wrapperClassName, ...props }, ref) => (
    <span className={cn('pa-select-wrap', wrapperClassName)}>
      <select ref={ref} className={cn('pa-select', className)} {...props} />
      <ChevronDown className="pa-i" aria-hidden />
    </span>
  ),
);
NativeSelect.displayName = 'NativeSelect';

export type NativeSelectOptionProps = React.OptionHTMLAttributes<HTMLOptionElement>;

export const NativeSelectOption = React.forwardRef<HTMLOptionElement, NativeSelectOptionProps>((props, ref) => (
  <option ref={ref} {...props} />
));
NativeSelectOption.displayName = 'NativeSelectOption';

export type NativeSelectOptGroupProps = React.OptgroupHTMLAttributes<HTMLOptGroupElement>;

export const NativeSelectOptGroup = React.forwardRef<HTMLOptGroupElement, NativeSelectOptGroupProps>((props, ref) => (
  <optgroup ref={ref} {...props} />
));
NativeSelectOptGroup.displayName = 'NativeSelectOptGroup';
