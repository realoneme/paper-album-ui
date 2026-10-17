import '@/styles/extra/slide-down.css';
import '@/styles/extra/dropdown-menu.css';
import '@/styles/extra/menubar.css';
import * as React from 'react';
import { Menubar as MenubarPrimitive } from 'radix-ui';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export const MenubarMenu = MenubarPrimitive.Menu;
export const MenubarGroup = MenubarPrimitive.Group;
export const MenubarPortal = MenubarPrimitive.Portal;
export const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

export type MenubarProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>;

/** The open menu's value ('' when none), so a menu closing because another one opened can skip its exit motion. */
const MenubarValueContext = React.createContext('');
/**
 * The last change of open menu (from → to). A sheet that mounts for a move between menus (from and to both set)
 * appears in place without its slide-down; only a first open slides.
 */
const MenubarSwapContext = React.createContext<React.MutableRefObject<{ from: string; to: string }> | null>(null);

/**
 * A desktop-style menu bar for editor screens. Arrow keys move between menus. Give it an aria-label.
 * A paper slip slides under the open menu's trigger and follows hover and arrow keys between menus.
 */
export const Menubar = React.forwardRef<React.ElementRef<typeof MenubarPrimitive.Root>, MenubarProps>(
  ({ className, children, value: valueProp, defaultValue = '', onValueChange, ...props }, ref) => {
    const [inner, setInner] = React.useState(defaultValue);
    const value = valueProp ?? inner;
    const swap = React.useRef({ from: '', to: value });
    if (swap.current.to !== value) swap.current = { from: swap.current.to, to: value };
    const handleValueChange = React.useCallback(
      (next: string) => {
        if (valueProp === undefined) setInner(next);
        onValueChange?.(next);
      },
      [valueProp, onValueChange],
    );
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const slipRef = React.useRef<HTMLSpanElement>(null);
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );
    // Whether the slip is showing; it jumps (no transition) when it first appears.
    const shown = React.useRef(false);

    React.useLayoutEffect(() => {
      const root = rootRef.current;
      const slip = slipRef.current;
      if (!root || !slip) return;
      const place = () => {
        const trigger = value ? root.querySelector<HTMLElement>('.pa-menubar-trigger[data-state="open"]') : null;
        if (!trigger) {
          slip.dataset.state = 'closed';
          shown.current = false;
          return;
        }
        const box = root.getBoundingClientRect();
        const t = trigger.getBoundingClientRect();
        slip.toggleAttribute('data-instant', !shown.current);
        slip.style.width = `${t.width}px`;
        slip.style.height = `${t.height}px`;
        slip.style.transform = `translate(${t.left - box.left - root.clientLeft}px, ${t.top - box.top - root.clientTop}px)`;
        slip.dataset.state = 'open';
        shown.current = true;
      };
      place();
      // Triggers can wrap onto a new row when the bar narrows.
      const observer = new ResizeObserver(place);
      observer.observe(root);
      return () => observer.disconnect();
    }, [value]);

    return (
      <MenubarPrimitive.Root
        ref={setRefs}
        className={cn('pa-menubar', className)}
        value={value}
        onValueChange={handleValueChange}
        {...props}
      >
        <span ref={slipRef} className="pa-menubar-slip" data-state="closed" aria-hidden="true" />
        <MenubarSwapContext.Provider value={swap}>
          <MenubarValueContext.Provider value={value}>{children}</MenubarValueContext.Provider>
        </MenubarSwapContext.Provider>
      </MenubarPrimitive.Root>
    );
  },
);
Menubar.displayName = 'Menubar';

export type MenubarTriggerProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>;

/** A top-level menu name. */
export const MenubarTrigger = React.forwardRef<React.ElementRef<typeof MenubarPrimitive.Trigger>, MenubarTriggerProps>(
  ({ className, ...props }, ref) => <MenubarPrimitive.Trigger ref={ref} className={cn('pa-menubar-trigger', className)} {...props} />,
);
MenubarTrigger.displayName = 'MenubarTrigger';
export type MenubarPortalContainer = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Portal>['container'];

export interface MenubarContentProps extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content> {
  /** Portal target (defaults to document.body). */
  container?: MenubarPortalContainer;
  /**
   * Called before the menu moves focus into itself on open; call event.preventDefault() to keep focus
   * where it is (used by demos that start open). Forwarded to Radix's menu focus scope.
   */
  onOpenAutoFocus?: (event: Event) => void;
}

/** The menu sheet. */
export const MenubarContent = React.forwardRef<React.ElementRef<typeof MenubarPrimitive.Content>, MenubarContentProps>(
  ({ className, container, align = 'start', sideOffset = 16, alignOffset = -4, onOpenAutoFocus, ...props }, ref) => {
    // Radix supports this handler on every menu content but only types it for sub-menus.
    const focusProps: object = { onOpenAutoFocus };
    // Switching menus (hover or arrows) swaps the sheets at once: a sheet still sliding out would see focus enter
    // the new one as an outside interaction and close the whole bar. Closing the bar plays the slide-up.
    const switching = React.useContext(MenubarValueContext) !== '';
    const swap = React.useContext(MenubarSwapContext);
    // Mark the sheet as it mounts (before its first paint, so the slide-down never starts).
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        if (node && swap && swap.current.from && swap.current.to) node.setAttribute('data-menubar-swapped-in', '');
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref, swap],
    );
    return (
      <MenubarPrimitive.Portal container={container}>
        <MenubarPrimitive.Content
          ref={setRefs}
          data-menubar-switching={switching ? '' : undefined}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          className={cn('pa-pop pa-menu pa-slide', className)}
          {...focusProps}
          {...props}
        />
      </MenubarPrimitive.Portal>
    );
  },
);
MenubarContent.displayName = 'MenubarContent';

export interface MenubarItemProps extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> {
  /** Indent to line up with checkable items. */
  inset?: boolean;
  /** `destructive` for the one item that removes or signs out; keep it last. */
  variant?: 'default' | 'destructive';
}

export const MenubarItem = React.forwardRef<React.ElementRef<typeof MenubarPrimitive.Item>, MenubarItemProps>(
  ({ className, inset, variant = 'default', ...props }, ref) => (
    <MenubarPrimitive.Item
      ref={ref}
      className={cn('pa-mi', inset && 'inset', variant === 'destructive' && 'danger', className)}
      {...props}
    />
  ),
);
MenubarItem.displayName = 'MenubarItem';

export type MenubarCheckboxItemProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>;

/** A toggle; the check mark shows the state, not colour alone. */
export const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  MenubarCheckboxItemProps
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem ref={ref} className={cn('pa-mi', className)} {...props}>
    <span className="pa-mi-ind">
      <MenubarPrimitive.ItemIndicator>
        <Check className="pa-i sm" aria-hidden />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
));
MenubarCheckboxItem.displayName = 'MenubarCheckboxItem';

export type MenubarRadioItemProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>;

export const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  MenubarRadioItemProps
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem ref={ref} className={cn('pa-mi', className)} {...props}>
    <span className="pa-mi-ind">
      <MenubarPrimitive.ItemIndicator>
        <span className="pa-mi-dot" aria-hidden />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
));
MenubarRadioItem.displayName = 'MenubarRadioItem';

export interface MenubarLabelProps extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> {
  inset?: boolean;
}

/** A small-caps group heading. */
export const MenubarLabel = React.forwardRef<React.ElementRef<typeof MenubarPrimitive.Label>, MenubarLabelProps>(
  ({ className, inset, ...props }, ref) => (
    <MenubarPrimitive.Label ref={ref} className={cn('pa-grp', inset && 'inset', className)} {...props} />
  ),
);
MenubarLabel.displayName = 'MenubarLabel';

export type MenubarSeparatorProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>;

export const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  MenubarSeparatorProps
>(({ className, ...props }, ref) => <MenubarPrimitive.Separator ref={ref} className={cn('pa-sep', className)} {...props} />);
MenubarSeparator.displayName = 'MenubarSeparator';

export type MenubarShortcutProps = React.HTMLAttributes<HTMLSpanElement>;

/** Right-aligned hint text. Spell keys out in words rather than glyphs. */
export function MenubarShortcut({ className, ...props }: MenubarShortcutProps) {
  return <span className={cn('sc', className)} {...props} />;
}
MenubarShortcut.displayName = 'MenubarShortcut';

export type MenubarSubProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Sub>;

const SubOpenContext = React.createContext<{ open: () => void } | null>(null);

/** A submenu. Controlled (`open` + `onOpenChange`) or not (`defaultOpen`); its trigger opens it on hover without delay. */
export function MenubarSub({ open: openProp, defaultOpen = false, onOpenChange, ...props }: MenubarSubProps) {
  const [inner, setInner] = React.useState(defaultOpen);
  const open = openProp ?? inner;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInner(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );
  const sub = React.useMemo(() => ({ open: () => !open && setOpen(true) }), [open, setOpen]);
  return (
    <SubOpenContext.Provider value={sub}>
      <MenubarPrimitive.Sub open={open} onOpenChange={setOpen} {...props} />
    </SubOpenContext.Provider>
  );
}
MenubarSub.displayName = 'MenubarSub';

export interface MenubarSubTriggerProps extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> {
  inset?: boolean;
}

/** Opens a submenu: at once on hover (Radix alone waits 100ms), or on click or the right arrow key. */
export const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  MenubarSubTriggerProps
>(({ className, inset, children, onPointerMove, ...props }, ref) => {
  const sub = React.useContext(SubOpenContext);
  return (
    <MenubarPrimitive.SubTrigger
      ref={ref}
      className={cn('pa-mi', inset && 'inset', className)}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (event.pointerType !== 'mouse' || props.disabled || !sub) return;
        // Radix handles the move after us and cancels it while the pointer heads for an open submenu.
        queueMicrotask(() => {
          if (!event.defaultPrevented) sub.open();
        });
      }}
      {...props}
    >
      {children}
      <span className="end"><ChevronRight className="pa-i sm" aria-hidden /></span>
    </MenubarPrimitive.SubTrigger>
  );
});
MenubarSubTrigger.displayName = 'MenubarSubTrigger';

export interface MenubarSubContentProps extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent> {
  /** Portal target (defaults to document.body). */
  container?: MenubarPortalContainer;
}

export const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  MenubarSubContentProps
>(({ className, container, sideOffset = 6, ...props }, ref) => (
  <MenubarPrimitive.Portal container={container}>
    <MenubarPrimitive.SubContent ref={ref} sideOffset={sideOffset} className={cn('pa-pop pa-menu pa-slide', className)} {...props} />
  </MenubarPrimitive.Portal>
));
MenubarSubContent.displayName = 'MenubarSubContent';
