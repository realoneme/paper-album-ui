import '@/styles/extra/input-otp.css';
import * as React from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { cn } from '@/lib/cn';

export type InputOTPProps = React.ComponentPropsWithoutRef<typeof OTPInput>;

/**
 * One groove per character for codes. Pass `maxLength` (usually 6) and compose groups of slots.
 * Works controlled (`value` + `onChange`) or uncontrolled (`defaultValue`). input-otp always renders a
 * controlled <input>, so an uncontrolled `defaultValue` is kept in local state rather than passed down.
 */
export const InputOTP = React.forwardRef<React.ElementRef<typeof OTPInput>, InputOTPProps>(
  ({ className, containerClassName, value, defaultValue, onChange, ...props }, ref) => {
    const [inner, setInner] = React.useState(() => String(defaultValue ?? ''));
    const controlled = value !== undefined;
    const handleChange = (next: string) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    };
    return (
      <OTPInput
        ref={ref}
        containerClassName={cn('pa-otp', props.disabled && 'is-disabled', containerClassName)}
        className={cn(className)}
        value={controlled ? value : inner}
        onChange={handleChange}
        {...props}
      />
    );
  },
);
InputOTP.displayName = 'InputOTP';

export type InputOTPGroupProps = React.HTMLAttributes<HTMLDivElement>;

/** A run of slots, usually three. */
export const InputOTPGroup = React.forwardRef<HTMLDivElement, InputOTPGroupProps>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('pa-otp-group', className)} {...props} />,
);
InputOTPGroup.displayName = 'InputOTPGroup';

export interface InputOTPSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Zero-based position of this slot in the code. */
  index: number;
}

/** One character groove; the active slot shows a primary inset and a caret. */
export const InputOTPSlot = React.forwardRef<HTMLDivElement, InputOTPSlotProps>(
  ({ index, className, ...props }, ref) => {
    const { slots } = React.useContext(OTPInputContext);
    const slot = slots[index];
    const char = slot?.char ?? null;
    return (
      <div
        ref={ref}
        data-active={slot?.isActive ? 'true' : undefined}
        className={cn('pa-otp-slot', slot?.isActive && 'active', className)}
        {...props}
      >
        {char}
        {slot?.hasFakeCaret && <span className="pa-otp-caret" aria-hidden="true" />}
      </div>
    );
  },
);
InputOTPSlot.displayName = 'InputOTPSlot';

export type InputOTPSeparatorProps = React.HTMLAttributes<HTMLSpanElement>;

/** A short paper dash between groups. */
export const InputOTPSeparator = React.forwardRef<HTMLSpanElement, InputOTPSeparatorProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} aria-hidden="true" className={cn('pa-otp-sep', className)} {...props} />
  ),
);
InputOTPSeparator.displayName = 'InputOTPSeparator';
