import '@/styles/extra/navigation-menu.css';
import * as React from 'react';
import { NavigationMenu as NavigationMenuPrimitive } from 'radix-ui';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export type NavigationMenuProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>;

/**
 * The site's main navigation. Panels open on hover, click or Enter and render inline under the strip
 * (no viewport); give the root an aria-label.
 */
export const NavigationMenu = React.forwardRef<React.ElementRef<typeof NavigationMenuPrimitive.Root>, NavigationMenuProps>(
  ({ className, ...props }, ref) => (
    <NavigationMenuPrimitive.Root ref={ref} className={cn('pa-navmenu-root', className)} {...props} />
  ),
);
NavigationMenu.displayName = 'NavigationMenu';

export type NavigationMenuListProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>;

/** The paper strip of top-level items. */
export const NavigationMenuList = React.forwardRef<React.ElementRef<typeof NavigationMenuPrimitive.List>, NavigationMenuListProps>(
  ({ className, ...props }, ref) => (
    <NavigationMenuPrimitive.List ref={ref} className={cn('pa-navmenu-list', className)} {...props} />
  ),
);
NavigationMenuList.displayName = 'NavigationMenuList';

export const NavigationMenuItem = NavigationMenuPrimitive.Item;
export type NavigationMenuItemProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>;

/** Class string for a top-level link or trigger, for custom elements. */
export const navigationMenuTriggerStyle = () => 'pa-navmenu-trigger';

export type NavigationMenuTriggerProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>;

/** A top-level item that opens a panel; the chevron turns when open. */
export const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  NavigationMenuTriggerProps
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger ref={ref} className={cn(navigationMenuTriggerStyle(), className)} {...props}>
    {children}
    <ChevronDown className="pa-i sm" aria-hidden />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

export type NavigationMenuContentProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>;

/** The wide panel: up to three covers and a link column. */
export const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  NavigationMenuContentProps
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content ref={ref} className={cn('pa-pop pa-navmenu-content', className)} {...props} />
));
NavigationMenuContent.displayName = 'NavigationMenuContent';

export interface NavigationMenuLinkProps extends React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link> {
  /** Style as a top-level strip item (default false: plain link inside a panel). */
  topLevel?: boolean;
}

/** A link. Set `active` for the current page (adds aria-current="page"). */
export const NavigationMenuLink = React.forwardRef<React.ElementRef<typeof NavigationMenuPrimitive.Link>, NavigationMenuLinkProps>(
  ({ className, topLevel = false, ...props }, ref) => (
    <NavigationMenuPrimitive.Link ref={ref} className={cn(topLevel && 'pa-navmenu-link', className)} {...props} />
  ),
);
NavigationMenuLink.displayName = 'NavigationMenuLink';
