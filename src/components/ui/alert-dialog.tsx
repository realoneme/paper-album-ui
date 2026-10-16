import '@/styles/extra/dialog.css';
import '@/styles/extra/alert-dialog.css';
import * as React from 'react';
import { AlertDialog as AlertDialogPrimitive } from 'radix-ui';
import type { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';

/** A confirmation that interrupts. Always modal: focus is trapped and outside clicks do nothing. */
export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogPortal = AlertDialogPrimitive.Portal;

export type AlertDialogProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Root>;
export type AlertDialogTriggerProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger>;
export type AlertDialogPortalContainer = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Portal>['container'];

export type AlertDialogOverlayProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>;

export const AlertDialogOverlay = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Overlay>, AlertDialogOverlayProps>(
  ({ className, ...props }, ref) => <AlertDialogPrimitive.Overlay ref={ref} className={cn('pa-backdrop', className)} {...props} />,
);
AlertDialogOverlay.displayName = 'AlertDialogOverlay';

export interface AlertDialogContentProps extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> {
  /** Portal target. Without it the dialog and backdrop are fixed to the viewport. */
  container?: AlertDialogPortalContainer;
}

/** The alert sheet (role="alertdialog"). Needs an AlertDialogTitle and AlertDialogDescription. */
export const AlertDialogContent = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Content>, AlertDialogContentProps>(
  ({ className, container, ...props }, ref) => (
    <AlertDialogPortal container={container}>
      <AlertDialogOverlay className={cn(!container && 'pa-fixed')} />
      <AlertDialogPrimitive.Content ref={ref} className={cn('pa-pop pa-dialog', !container && 'pa-fixed', className)} {...props} />
    </AlertDialogPortal>
  ),
);
AlertDialogContent.displayName = 'AlertDialogContent';

export type AlertDialogHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export const AlertDialogHeader = React.forwardRef<HTMLDivElement, AlertDialogHeaderProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pa-dialog-header', className)} {...props} />
));
AlertDialogHeader.displayName = 'AlertDialogHeader';

export type AlertDialogFooterProps = React.HTMLAttributes<HTMLDivElement>;

/** The safe action first, then the destructive action labelled with its verb. */
export const AlertDialogFooter = React.forwardRef<HTMLDivElement, AlertDialogFooterProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pa-dialog-footer', className)} {...props} />
));
AlertDialogFooter.displayName = 'AlertDialogFooter';

export type AlertDialogTitleProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>;

/** Phrase it as a question: "Delete this album?" */
export const AlertDialogTitle = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Title>, AlertDialogTitleProps>(
  ({ className, ...props }, ref) => <AlertDialogPrimitive.Title ref={ref} className={cn('pa-dialog-title', className)} {...props} />,
);
AlertDialogTitle.displayName = 'AlertDialogTitle';

export type AlertDialogDescriptionProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>;

/** What will happen and what stays safe. */
export const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  AlertDialogDescriptionProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description ref={ref} className={cn('pa-caption pa-alert-desc', className)} {...props} />
));
AlertDialogDescription.displayName = 'AlertDialogDescription';

type ButtonStyleProps = VariantProps<typeof buttonVariants>;

export interface AlertDialogActionProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>,
    ButtonStyleProps {}

/** The confirming action. Use variant="destructive" when it removes something. */
export const AlertDialogAction = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Action>, AlertDialogActionProps>(
  ({ className, variant = 'default', size, ...props }, ref) => (
    <AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
AlertDialogAction.displayName = 'AlertDialogAction';

export interface AlertDialogCancelProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>,
    ButtonStyleProps {}

/** The safe choice; it receives focus when the dialog opens. */
export const AlertDialogCancel = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Cancel>, AlertDialogCancelProps>(
  ({ className, variant = 'secondary', size, ...props }, ref) => (
    <AlertDialogPrimitive.Cancel ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
AlertDialogCancel.displayName = 'AlertDialogCancel';
