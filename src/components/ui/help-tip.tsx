import '@/styles/extra/popover.css';
import '@/styles/extra/help-tip.css';
import * as React from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { CircleHelp } from 'lucide-react';
import { cn } from '@/lib/cn';

export type HelpTipPortalContainer = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Portal>['container'];

export interface HelpTipProps {
  /** What the help is about, e.g. "About album titles". The button's accessible name and the bubble's label. */
  label: string;
  /** The help itself: a sentence or two, optionally a "Learn more" link. */
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Portal target (defaults to document.body). */
  container?: HelpTipPortalContainer;
  className?: string;
  contentClassName?: string;
}

/** How long the bubble waits after the pointer leaves before it closes, so it can be reached. */
const LEAVE_DELAY = 150;

/**
 * A "?" beside a label that explains a setting (a toggletip). It opens the same way everywhere it can:
 * hovering with a mouse opens it at once, a tap or click toggles it (so it works on phones), Enter or Space
 * opens it from the keyboard and Escape closes it. A click after a hover-open keeps it open. Focus stays on
 * the "?" and the bubble is a labelled, non-modal sheet. For naming an icon button use Tooltip instead.
 */
export const HelpTip = React.forwardRef<HTMLButtonElement, HelpTipProps>(
  (
    { label, children, side = 'bottom', align = 'center', open: openProp, defaultOpen = false, onOpenChange, container, className, contentClassName },
    ref,
  ) => {
    const [inner, setInner] = React.useState(defaultOpen);
    const open = openProp ?? inner;
    const setOpen = React.useCallback(
      (next: boolean) => {
        if (openProp === undefined) setInner(next);
        onOpenChange?.(next);
      },
      [openProp, onOpenChange],
    );
    // Opened by a mouse hover (closes again on leave) until a click pins it.
    const byHover = React.useRef(false);
    const leaveTimer = React.useRef<number | undefined>(undefined);
    const cancelLeave = () => window.clearTimeout(leaveTimer.current);
    const leave = (event: React.PointerEvent) => {
      if (event.pointerType !== 'mouse' || !byHover.current) return;
      cancelLeave();
      leaveTimer.current = window.setTimeout(() => {
        byHover.current = false;
        setOpen(false);
      }, LEAVE_DELAY);
    };
    React.useEffect(() => cancelLeave, []);

    const onOpenChangeFromRadix = (next: boolean) => {
      if (!next) byHover.current = false;
      cancelLeave();
      setOpen(next);
    };

    return (
      <PopoverPrimitive.Root open={open} onOpenChange={onOpenChangeFromRadix}>
        <PopoverPrimitive.Trigger
          ref={ref}
          type="button"
          aria-label={label}
          className={cn('pa-helptip', className)}
          onPointerEnter={(event) => {
            if (event.pointerType !== 'mouse') return;
            cancelLeave();
            if (!open) {
              byHover.current = true;
              setOpen(true);
            }
          }}
          onPointerLeave={leave}
          onClick={(event) => {
            // The hover already opened it: this click pins it open instead of toggling it shut.
            if (byHover.current && open) {
              event.preventDefault();
              byHover.current = false;
              cancelLeave();
            }
          }}
        >
          <CircleHelp className="pa-i" aria-hidden />
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal container={container}>
          <PopoverPrimitive.Content
            side={side}
            align={align}
            sideOffset={10}
            collisionPadding={16}
            aria-label={label}
            className={cn('pa-pop pa-popover pa-helptip-content', contentClassName)}
            onOpenAutoFocus={(event) => event.preventDefault()}
            onPointerEnter={(event) => {
              if (event.pointerType === 'mouse') cancelLeave();
            }}
            onPointerLeave={leave}
          >
            {children}
            {/* Radix places the pointer under the key even when the bubble shifts to stay on screen. */}
            <PopoverPrimitive.Arrow className="pa-helptip-arrow" width={16} height={8} />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
  },
);
HelpTip.displayName = 'HelpTip';
