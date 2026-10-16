import '@/styles/extra/dropdown-menu.css';
import '@/styles/extra/context-menu.css';
import * as React from 'react';
import { ContextMenu as ContextMenuPrimitive } from 'radix-ui';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

/** The same menu on right-click or long-press, for actions on one item. Keep every action reachable another way too. */
export const ContextMenu = ContextMenuPrimitive.Root;
/** The area that opens the menu on right-click, long-press or the keyboard context-menu key. */
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
export const ContextMenuGroup = ContextMenuPrimitive.Group;
export const ContextMenuPortal = ContextMenuPrimitive.Portal;
export const ContextMenuSub = ContextMenuPrimitive.Sub;
export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

export type ContextMenuProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Root>;
export type ContextMenuPortalContainer = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Portal>['container'];

export interface ContextMenuContentProps extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content> {
  /** Portal target (defaults to document.body). */
  container?: ContextMenuPortalContainer;
  /**
   * Called before the menu moves focus into itself on open; call event.preventDefault() to keep focus
   * where it is (used by demos that start open). Forwarded to Radix's menu focus scope.
   */
  onOpenAutoFocus?: (event: Event) => void;
}

/** The menu sheet, placed at the pointer. */
export const ContextMenuContent = React.forwardRef<React.ElementRef<typeof ContextMenuPrimitive.Content>, ContextMenuContentProps>(
  ({ className, container, onOpenAutoFocus, ...props }, ref) => {
    // Radix supports this handler on every menu content but only types it for sub-menus.
    const focusProps: object = { onOpenAutoFocus };
    return (
      <ContextMenuPrimitive.Portal container={container}>
        <ContextMenuPrimitive.Content
          ref={ref}
          className={cn('pa-pop pa-menu', className)}
          {...focusProps}
          {...props}
        />
      </ContextMenuPrimitive.Portal>
    );
  },
);
ContextMenuContent.displayName = 'ContextMenuContent';

export interface ContextMenuItemProps extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> {
  /** Indent to line up with checkable items. */
  inset?: boolean;
  /** `destructive` for the one item that removes or signs out; keep it last. */
  variant?: 'default' | 'destructive';
}

export const ContextMenuItem = React.forwardRef<React.ElementRef<typeof ContextMenuPrimitive.Item>, ContextMenuItemProps>(
  ({ className, inset, variant = 'default', ...props }, ref) => (
    <ContextMenuPrimitive.Item
      ref={ref}
      className={cn('pa-mi', inset && 'inset', variant === 'destructive' && 'danger', className)}
      {...props}
    />
  ),
);
ContextMenuItem.displayName = 'ContextMenuItem';

export type ContextMenuCheckboxItemProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>;

/** A toggle; the check mark shows the state, not colour alone. */
export const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  ContextMenuCheckboxItemProps
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem ref={ref} className={cn('pa-mi', className)} {...props}>
    <span className="pa-mi-ind">
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="pa-i sm" aria-hidden />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
));
ContextMenuCheckboxItem.displayName = 'ContextMenuCheckboxItem';

export type ContextMenuRadioItemProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>;

export const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  ContextMenuRadioItemProps
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem ref={ref} className={cn('pa-mi', className)} {...props}>
    <span className="pa-mi-ind">
      <ContextMenuPrimitive.ItemIndicator>
        <span className="pa-mi-dot" aria-hidden />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
));
ContextMenuRadioItem.displayName = 'ContextMenuRadioItem';

export interface ContextMenuLabelProps extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> {
  inset?: boolean;
}

/** A small-caps group heading. */
export const ContextMenuLabel = React.forwardRef<React.ElementRef<typeof ContextMenuPrimitive.Label>, ContextMenuLabelProps>(
  ({ className, inset, ...props }, ref) => (
    <ContextMenuPrimitive.Label ref={ref} className={cn('pa-grp', inset && 'inset', className)} {...props} />
  ),
);
ContextMenuLabel.displayName = 'ContextMenuLabel';

export type ContextMenuSeparatorProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>;

export const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  ContextMenuSeparatorProps
>(({ className, ...props }, ref) => <ContextMenuPrimitive.Separator ref={ref} className={cn('pa-sep', className)} {...props} />);
ContextMenuSeparator.displayName = 'ContextMenuSeparator';

export type ContextMenuShortcutProps = React.HTMLAttributes<HTMLSpanElement>;

/** Right-aligned hint text. Spell keys out in words rather than glyphs. */
export function ContextMenuShortcut({ className, ...props }: ContextMenuShortcutProps) {
  return <span className={cn('sc', className)} {...props} />;
}
ContextMenuShortcut.displayName = 'ContextMenuShortcut';

export interface ContextMenuSubTriggerProps extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> {
  inset?: boolean;
}

/** Opens a submenu (hover, click or the right arrow key). */
export const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  ContextMenuSubTriggerProps
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger ref={ref} className={cn('pa-mi', inset && 'inset', className)} {...props}>
    {children}
    <span className="end"><ChevronRight className="pa-i sm" aria-hidden /></span>
  </ContextMenuPrimitive.SubTrigger>
));
ContextMenuSubTrigger.displayName = 'ContextMenuSubTrigger';

export interface ContextMenuSubContentProps extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent> {
  /** Portal target (defaults to document.body). */
  container?: ContextMenuPortalContainer;
}

export const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  ContextMenuSubContentProps
>(({ className, container, sideOffset = 6, ...props }, ref) => (
  <ContextMenuPrimitive.Portal container={container}>
    <ContextMenuPrimitive.SubContent ref={ref} sideOffset={sideOffset} className={cn('pa-pop pa-menu', className)} {...props} />
  </ContextMenuPrimitive.Portal>
));
ContextMenuSubContent.displayName = 'ContextMenuSubContent';
