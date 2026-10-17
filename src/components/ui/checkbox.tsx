import '@/styles/extra/checkbox.css';
import * as React from 'react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';

export type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>;

/**
 * A sunken square that fills with deep wood when checked. `checked` accepts true, false or
 * 'indeterminate' (rendered as aria-checked="mixed"). Children become the visible label.
 * The tick draws in and out (the indicator stays mounted), and the box gives a small pop
 * on every change after mount.
 */
export const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, children, checked, onCheckedChange, ...props }, ref) => {
    // Alternating "a"/"b" restarts the pop keyframes on each change; nothing pops on mount.
    const [pop, setPop] = React.useState<'a' | 'b' | undefined>(undefined);
    const flip = React.useCallback(() => setPop((p) => (p === 'a' ? 'b' : 'a')), []);
    const prevChecked = React.useRef(checked);
    React.useEffect(() => {
      if (prevChecked.current === checked) return;
      prevChecked.current = checked;
      flip();
    }, [checked, flip]);

    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn('pa-check', className)}
        checked={checked}
        onCheckedChange={(next) => {
          if (checked === undefined) flip();
          onCheckedChange?.(next);
        }}
        {...props}
      >
        <span className="box" data-pop={pop}>
          <CheckboxPrimitive.Indicator forceMount className="pa-check-indicator">
            <Check className="pa-i pa-check-tick" aria-hidden />
            <Minus className="pa-i pa-check-dash" aria-hidden />
          </CheckboxPrimitive.Indicator>
        </span>
        {children}
      </CheckboxPrimitive.Root>
    );
  },
);
Checkbox.displayName = 'Checkbox';
