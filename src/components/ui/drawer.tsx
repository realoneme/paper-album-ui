import '@/styles/extra/dialog.css';
import '@/styles/extra/drawer.css';
import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';
import { cn } from '@/lib/cn';

export type DrawerProps = React.ComponentProps<typeof DrawerPrimitive.Root>;

/** A bottom sheet with a grab handle, for phones and quick choices. Drag down or press Escape to close. */
export function Drawer({ autoFocus = true, ...props }: DrawerProps) {
  // vaul leaves focus on the trigger by default, outside the modal sheet: Escape then does nothing and keyboard
  // users are stuck behind the locked page. Move focus into the sheet, as Radix Dialog does.
  return <DrawerPrimitive.Root autoFocus={autoFocus} {...props} />;
}
Drawer.displayName = 'Drawer';

export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerPortal = DrawerPrimitive.Portal;
export const DrawerClose = DrawerPrimitive.Close;

export type DrawerPortalContainer = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Portal>['container'];
export type DrawerOverlayProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>;

/** The dimmed backdrop. vaul renders it only for modal drawers. */
export const DrawerOverlay = React.forwardRef<React.ElementRef<typeof DrawerPrimitive.Overlay>, DrawerOverlayProps>(
  ({ className, ...props }, ref) => <DrawerPrimitive.Overlay ref={ref} className={cn('pa-backdrop', className)} {...props} />,
);
DrawerOverlay.displayName = 'DrawerOverlay';

export interface DrawerContentProps extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> {
  /** Portal target. Without it the drawer and backdrop are fixed to the viewport. */
  container?: DrawerPortalContainer;
}

/** The drawer sheet with its handle. Needs a DrawerTitle. */
export const DrawerContent = React.forwardRef<React.ElementRef<typeof DrawerPrimitive.Content>, DrawerContentProps>(
  ({ className, children, container, ...props }, ref) => (
    <DrawerPortal container={container}>
      <DrawerOverlay className={cn(!container && 'pa-fixed')} />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn('pa-pop pa-drawer', !container && 'pa-fixed', className)}
        {...(container ? { 'data-vaul-custom-container': 'true' } : {})}
        {...props}
      >
        <div className="pa-drawer-handle" aria-hidden="true" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  ),
);
DrawerContent.displayName = 'DrawerContent';

export type DrawerHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export const DrawerHeader = React.forwardRef<HTMLDivElement, DrawerHeaderProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pa-drawer-header', className)} {...props} />
));
DrawerHeader.displayName = 'DrawerHeader';

export type DrawerFooterProps = React.HTMLAttributes<HTMLDivElement>;

/** Secondary action, then the primary action that states the price or result. */
export const DrawerFooter = React.forwardRef<HTMLDivElement, DrawerFooterProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pa-drawer-footer', className)} {...props} />
));
DrawerFooter.displayName = 'DrawerFooter';

export type DrawerTitleProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>;

export const DrawerTitle = React.forwardRef<React.ElementRef<typeof DrawerPrimitive.Title>, DrawerTitleProps>(
  ({ className, ...props }, ref) => <DrawerPrimitive.Title ref={ref} className={cn('pa-h4', className)} {...props} />,
);
DrawerTitle.displayName = 'DrawerTitle';

export type DrawerDescriptionProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>;

export const DrawerDescription = React.forwardRef<React.ElementRef<typeof DrawerPrimitive.Description>, DrawerDescriptionProps>(
  ({ className, ...props }, ref) => <DrawerPrimitive.Description ref={ref} className={cn('pa-caption', className)} {...props} />,
);
DrawerDescription.displayName = 'DrawerDescription';
