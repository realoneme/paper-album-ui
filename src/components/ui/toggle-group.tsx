import '@/styles/extra/toggle-group.css';
import * as React from 'react';
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';
import { cn } from '@/lib/cn';

export type ToggleGroupProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>;
type SingleProps = Extract<ToggleGroupProps, { type: 'single' }>;

interface ThumbRect { x: number; y: number; width: number; height: number }

function assignRef<T>(ref: React.ForwardedRef<T>, node: T | null) {
  if (typeof ref === 'function') ref(node);
  else if (ref) ref.current = node;
}

const SingleToggleGroup = React.forwardRef<HTMLDivElement, SingleProps>(
  ({ className, children, value, defaultValue, onValueChange, ...props }, ref) => {
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const [inner, setInner] = React.useState(defaultValue ?? '');
    const current = value ?? inner;
    const [rect, setRect] = React.useState<ThumbRect | null>(null);
    const [animate, setAnimate] = React.useState(false);

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        assignRef(ref, node);
      },
      [ref],
    );

    const measure = React.useCallback(() => {
      const root = rootRef.current;
      const item = root?.querySelector<HTMLElement>('[data-state="on"]');
      if (!root || !item) {
        setRect(null);
        return;
      }
      const r = root.getBoundingClientRect();
      const i = item.getBoundingClientRect();
      const next = {
        x: i.left - r.left - root.clientLeft,
        y: i.top - r.top - root.clientTop,
        width: i.width,
        height: i.height,
      };
      setRect((prev) =>
        prev && prev.x === next.x && prev.y === next.y && prev.width === next.width && prev.height === next.height
          ? prev
          : next,
      );
    }, []);

    // Re-measure whenever the selection changes (click, keyboard or a controlled value).
    React.useLayoutEffect(() => {
      measure();
    }, [current, measure]);

    // Re-measure when the strip or any item changes size (fonts loading, wrapping, viewport).
    React.useEffect(() => {
      const root = rootRef.current;
      if (!root || typeof ResizeObserver === 'undefined') return;
      const ro = new ResizeObserver(() => measure());
      ro.observe(root);
      root.querySelectorAll('button').forEach((b) => ro.observe(b));
      return () => ro.disconnect();
    }, [measure, children]);

    // The first placement (and each re-appearance) is instant; only later moves slide.
    const visible = rect !== null;
    React.useEffect(() => {
      if (!visible) {
        setAnimate(false);
        return;
      }
      const id = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(id);
    }, [visible]);

    return (
      <ToggleGroupPrimitive.Root
        ref={setRefs}
        className={cn('pa-tgroup', className)}
        data-thumb={visible ? 'true' : undefined}
        value={current}
        onValueChange={(next: string) => {
          if (value === undefined) setInner(next);
          onValueChange?.(next);
        }}
        {...props}
      >
        {rect && (
          <span
            className="pa-tgroup-thumb"
            aria-hidden="true"
            data-animate={animate ? 'true' : 'false'}
            style={{
              width: rect.width,
              height: rect.height,
              transform: `translate(${rect.x}px, ${rect.y}px)`,
            }}
          />
        )}
        {children}
      </ToggleGroupPrimitive.Root>
    );
  },
);
SingleToggleGroup.displayName = 'SingleToggleGroup';

/**
 * A segmented strip of toggles. `type="single"` renders a radiogroup (items get `aria-checked`)
 * with one paper thumb that slides to the chosen item; `type="multiple"` a toolbar (items get
 * `aria-pressed`) where each item rises on its own. Give it an `aria-label`.
 */
export const ToggleGroup = React.forwardRef<React.ElementRef<typeof ToggleGroupPrimitive.Root>, ToggleGroupProps>(
  (props, ref) => {
    if (props.type === 'single') return <SingleToggleGroup ref={ref} {...props} />;
    const { className, ...rest } = props;
    return <ToggleGroupPrimitive.Root ref={ref} className={cn('pa-tgroup', className)} {...rest} />;
  },
);
ToggleGroup.displayName = 'ToggleGroup';

export type ToggleGroupItemProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>;

/** One segment; the chosen segment rises out of the groove. */
export const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Item ref={ref} className={cn(className)} {...props} />
));
ToggleGroupItem.displayName = 'ToggleGroupItem';
