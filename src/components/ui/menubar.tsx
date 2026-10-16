import '@/styles/extra/dropdown-menu.css';
import '@/styles/extra/menubar.css';
import * as React from 'react';
import { Menubar as MenubarPrimitive } from 'radix-ui';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export const MenubarMenu = MenubarPrimitive.Menu;
export const MenubarGroup = MenubarPrimitive.Group;
export const MenubarPortal = MenubarPrimitive.Portal;
export const MenubarSub = MenubarPrimitive.Sub;
export const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

export type MenubarProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>;

/** A desktop-style menu bar for editor screens. Arrow keys move between menus. Give it an aria-label. */
export const Menubar = React.forwardRef<React.ElementRef<typeof MenubarPrimitive.Root>, MenubarProps>(
  ({ className, ...props }, ref) => <MenubarPrimitive.Root ref={ref} className={cn('pa-menubar', className)} {...props} />,
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
  ({ className, container, align = 'start', sideOffset = 8, alignOffset = -4, onOpenAutoFocus, ...props }, ref) => {
    // Radix supports this handler on every menu content but only types it for sub-menus.
    const focusProps: object = { onOpenAutoFocus };
    return (
      <MenubarPrimitive.Portal container={container}>
        <MenubarPrimitive.Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          className={cn('pa-pop pa-menu', className)}
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

export interface MenubarSubTriggerProps extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> {
  inset?: boolean;
}

/** Opens a submenu (hover, click or the right arrow key). */
export const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  MenubarSubTriggerProps
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger ref={ref} className={cn('pa-mi', inset && 'inset', className)} {...props}>
    {children}
    <span className="end"><ChevronRight className="pa-i sm" aria-hidden /></span>
  </MenubarPrimitive.SubTrigger>
));
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
    <MenubarPrimitive.SubContent ref={ref} sideOffset={sideOffset} className={cn('pa-pop pa-menu', className)} {...props} />
  </MenubarPrimitive.Portal>
));
MenubarSubContent.displayName = 'MenubarSubContent';
