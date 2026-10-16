import '@/styles/extra/dialog.css';
import * as React from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

/** A top sheet over a dimmed page for one focused edit. Modal by default (focus trap, Escape, scroll lock). */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export type DialogProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>;
export type DialogTriggerProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>;
export type DialogCloseProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>;
/** Where the dialog is portaled. Defaults to document.body; pass an element to keep it inside a positioned stage. */
export type DialogPortalContainer = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>['container'];

export type DialogOverlayProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>;

/** The dimmed backdrop. Radix renders it only for modal dialogs. */
export const DialogOverlay = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Overlay>, DialogOverlayProps>(
  ({ className, ...props }, ref) => <DialogPrimitive.Overlay ref={ref} className={cn('pa-backdrop', className)} {...props} />,
);
DialogOverlay.displayName = 'DialogOverlay';

export interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** Portal target. Without it the dialog and backdrop are fixed to the viewport. */
  container?: DialogPortalContainer;
  /** Show the corner close button (default true). */
  showCloseButton?: boolean;
  /** Accessible name of the close button. */
  closeLabel?: string;
}

/** The dialog sheet, with backdrop and a labelled close button. Always include a DialogTitle. */
export const DialogContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, DialogContentProps>(
  ({ className, children, container, showCloseButton = true, closeLabel = 'Close', ...props }, ref) => (
    <DialogPortal container={container}>
      <DialogOverlay className={cn(!container && 'pa-fixed')} />
      <DialogPrimitive.Content ref={ref} className={cn('pa-pop pa-dialog', !container && 'pa-fixed', className)} {...props}>
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close className="pa-close" aria-label={closeLabel}>
            <X className="pa-i" aria-hidden />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  ),
);
DialogContent.displayName = 'DialogContent';

export type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement>;

/** Title and description, kept clear of the close button. */
export const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pa-dialog-header', className)} {...props} />
));
DialogHeader.displayName = 'DialogHeader';

export type DialogFooterProps = React.HTMLAttributes<HTMLDivElement>;

/** Actions, right-aligned: secondary first, the default action last. */
export const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pa-dialog-footer', className)} {...props} />
));
DialogFooter.displayName = 'DialogFooter';

export type DialogTitleProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

export const DialogTitle = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Title>, DialogTitleProps>(
  ({ className, ...props }, ref) => <DialogPrimitive.Title ref={ref} className={cn('pa-dialog-title', className)} {...props} />,
);
DialogTitle.displayName = 'DialogTitle';

export type DialogDescriptionProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>;

export const DialogDescription = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Description>, DialogDescriptionProps>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Description ref={ref} className={cn('pa-caption pa-dialog-desc', className)} {...props} />
  ),
);
DialogDescription.displayName = 'DialogDescription';
