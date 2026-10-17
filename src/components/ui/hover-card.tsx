import '@/styles/extra/hover-card.css';
import * as React from 'react';
import { HoverCard as HoverCardPrimitive } from 'radix-ui';
import { cn } from '@/lib/cn';

/** Card width used for the pointer alignment until the real card has been measured (matches hover-card.css). */
const DEFAULT_CARD_WIDTH = 248;

interface HoverCardAnchor {
  /** Where the card hangs from, in px from the trigger's left edge (null until the trigger is measured). */
  x: number | null;
  setX: (x: number) => void;
}

const AnchorContext = React.createContext<HoverCardAnchor | null>(null);

export type HoverCardProps = React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Root>;

/**
 * A preview while hovering or focusing a link. Never the only copy of the information.
 * Opens immediately (openDelay 0) and closes after a short grace period (closeDelay 120).
 */
export function HoverCard({ openDelay = 0, closeDelay = 120, ...props }: HoverCardProps) {
  const [x, setX] = React.useState<number | null>(null);
  const anchor = React.useMemo(() => ({ x, setX }), [x]);
  return (
    <AnchorContext.Provider value={anchor}>
      <HoverCardPrimitive.Root openDelay={openDelay} closeDelay={closeDelay} {...props} />
    </AnchorContext.Provider>
  );
}
HoverCard.displayName = 'HoverCard';

export type HoverCardTriggerProps = React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Trigger>;

/** The link. Records where the pointer enters so the card can drop from that point. */
export const HoverCardTrigger = React.forwardRef<React.ElementRef<typeof HoverCardPrimitive.Trigger>, HoverCardTriggerProps>(
  ({ onPointerEnter, onPointerMove, onFocus, ...props }, ref) => {
    const anchor = React.useContext(AnchorContext);
    const setX = anchor?.setX;
    const unset = anchor?.x === null;
    const local = React.useRef<HTMLAnchorElement | null>(null);
    const setRefs = React.useCallback(
      (el: HTMLAnchorElement | null) => {
        local.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) ref.current = el;
      },
      [ref],
    );
    // Before any pointer arrives (defaultOpen, keyboard), hang the card from the trigger's centre.
    React.useLayoutEffect(() => {
      if (unset && setX && local.current) setX(local.current.getBoundingClientRect().width / 2);
    }, [unset, setX]);
    const track = (event: React.PointerEvent<HTMLAnchorElement>) => {
      if (event.pointerType === 'touch' || !setX) return;
      setX(event.clientX - event.currentTarget.getBoundingClientRect().left);
    };
    return (
      <HoverCardPrimitive.Trigger
        ref={setRefs}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);
          track(event);
        }}
        onPointerMove={(event) => {
          onPointerMove?.(event);
          // Follow the pointer only until the card is shown, so the open card stays put while it swings.
          if (event.currentTarget.dataset.state !== 'open') track(event);
        }}
        onFocus={(event) => {
          onFocus?.(event);
          setX?.(event.currentTarget.getBoundingClientRect().width / 2);
        }}
        {...props}
      />
    );
  },
);
HoverCardTrigger.displayName = 'HoverCardTrigger';

export type HoverCardPortalContainer = React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Portal>['container'];

export interface HoverCardContentProps extends React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content> {
  /** Portal target (defaults to document.body). */
  container?: HoverCardPortalContainer;
}

/**
 * The portrait preview card. It hangs on a thread (as long as `sideOffset`) from the point where the
 * pointer entered the trigger, drops in and swings to rest; it lifts away on close. Pass `alignOffset`
 * to place it yourself instead of following the pointer.
 */
export const HoverCardContent = React.forwardRef<React.ElementRef<typeof HoverCardPrimitive.Content>, HoverCardContentProps>(
  ({ className, container, align = 'start', side = 'bottom', sideOffset = 18, alignOffset, style, ...props }, ref) => {
    const anchor = React.useContext(AnchorContext);
    const [width, setWidth] = React.useState(DEFAULT_CARD_WIDTH);
    const setRefs = React.useCallback(
      (el: HTMLDivElement | null) => {
        if (el && el.offsetWidth > 0) setWidth(el.offsetWidth);
        if (typeof ref === 'function') ref(el);
        else if (ref) ref.current = el;
      },
      [ref],
    );
    const followPointer = alignOffset === undefined && align === 'start' && anchor?.x != null;
    const offset = followPointer && anchor?.x != null ? Math.round(anchor.x - width / 2) : (alignOffset ?? 0);
    const threadStyle = { '--thread': `${sideOffset}px`, ...style } as React.CSSProperties;
    return (
      <HoverCardPrimitive.Portal container={container}>
        <HoverCardPrimitive.Content
          ref={setRefs}
          align={align}
          side={side}
          sideOffset={sideOffset}
          alignOffset={offset}
          data-align-offset={offset}
          style={threadStyle}
          className={cn('pa-pop pa-hovercard', className)}
          {...props}
        />
      </HoverCardPrimitive.Portal>
    );
  },
);
HoverCardContent.displayName = 'HoverCardContent';
