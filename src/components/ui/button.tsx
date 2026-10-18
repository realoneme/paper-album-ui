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

/** Shortest time a key stays pressed, so a trackpad tap (down and up in the same instant) still shows the press. */
const MIN_PRESS_MS = 140;

/**
 * Marks the key as pressed (`data-pressed`) from pointer down, or Enter/Space, until release, and for at least
 * MIN_PRESS_MS. CSS `:active` alone misses a tap-to-click, which is over before a frame is drawn.
 */
function usePress(disabled: boolean | undefined, handlers: React.HTMLAttributes<HTMLElement>) {
  const [pressed, setPressed] = React.useState(false);
  const since = React.useRef(0);
  const timer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  const down = () => {
    if (disabled) return;
    window.clearTimeout(timer.current);
    since.current = performance.now();
    setPressed(true);
  };
  const up = () => {
    window.clearTimeout(timer.current);
    const left = MIN_PRESS_MS - (performance.now() - since.current);
    if (left <= 0) setPressed(false);
    else timer.current = window.setTimeout(() => setPressed(false), left);
  };
  const isKey = (e: React.KeyboardEvent) => e.key === 'Enter' || e.key === ' ';
  return {
    pressed,
    props: {
      onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
        handlers.onPointerDown?.(e);
        if (e.button === 0) down();
      },
      onPointerUp: (e: React.PointerEvent<HTMLElement>) => {
        handlers.onPointerUp?.(e);
        up();
      },
      onPointerCancel: (e: React.PointerEvent<HTMLElement>) => {
        handlers.onPointerCancel?.(e);
        up();
      },
      onPointerLeave: (e: React.PointerEvent<HTMLElement>) => {
        handlers.onPointerLeave?.(e);
        if (pressed) up();
      },
      onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
        handlers.onKeyDown?.(e);
        if (isKey(e) && !e.repeat) down();
      },
      onKeyUp: (e: React.KeyboardEvent<HTMLElement>) => {
        handlers.onKeyUp?.(e);
        if (isKey(e)) up();
      },
      onBlur: (e: React.FocusEvent<HTMLElement>) => {
        handlers.onBlur?.(e);
        if (pressed) up();
      },
    },
  };
}

/**
 * A paper key. `default` is the one primary action per view. Pressed, the key sinks 2px onto its edge and loses
 * its soft shadow; the edge stays, so it still reads as a key.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, type, onPointerDown, onPointerUp, onPointerCancel, onPointerLeave, onKeyDown, onKeyUp, onBlur, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot.Root : 'button';
    const press = usePress(props.disabled, { onPointerDown, onPointerUp, onPointerCancel, onPointerLeave, onKeyDown, onKeyUp, onBlur } as React.HTMLAttributes<HTMLElement>);
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        type={asChild ? undefined : (type ?? 'button')}
        data-pressed={press.pressed ? '' : undefined}
        {...press.props}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
