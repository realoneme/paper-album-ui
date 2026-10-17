import '@/styles/extra/dialog.css';
import '@/styles/extra/sheet.css';
import * as React from 'react';
import { Dialog as SheetPrimitive } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

/** A panel that slides from an edge. Built on the Dialog primitive: modal by default. */
export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;
export const SheetPortal = SheetPrimitive.Portal;

export type SheetProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Root>;
export type SheetPortalContainer = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Portal>['container'];

export type SheetOverlayProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>;

export const SheetOverlay = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Overlay>, SheetOverlayProps>(
  ({ className, ...props }, ref) => <SheetPrimitive.Overlay ref={ref} className={cn('pa-backdrop pa-fade', className)} {...props} />,
);
SheetOverlay.displayName = 'SheetOverlay';

export const sheetVariants = cva('pa-pop pa-sheet', {
  variants: {
    side: { right: '', left: 'pa-sheet-left', top: 'pa-sheet-top', bottom: 'pa-sheet-bottom' },
  },
  defaultVariants: { side: 'right' },
});

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  /** Portal target. Without it the sheet and backdrop are fixed to the viewport. */
  container?: SheetPortalContainer;
  /** Show the corner close button (default true). */
  showCloseButton?: boolean;
  closeLabel?: string;
}

/** The sheet itself; `side` picks the edge (right by default). Slides in from that edge with a slight overshoot and back out on close. Needs a SheetTitle. */
export const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, SheetContentProps>(
  ({ className, children, side, container, showCloseButton = true, closeLabel = 'Close', ...props }, ref) => (
    <SheetPortal container={container}>
      <SheetOverlay className={cn(!container && 'pa-fixed')} />
      <SheetPrimitive.Content
        ref={ref}
        data-side={side ?? 'right'}
        className={cn(sheetVariants({ side }), !container && 'pa-fixed', className)}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close className="pa-close" aria-label={closeLabel}>
            <X className="pa-i" aria-hidden />
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  ),
);
SheetContent.displayName = 'SheetContent';

export type SheetHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export const SheetHeader = React.forwardRef<HTMLDivElement, SheetHeaderProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pa-sheet-header', className)} {...props} />
));
SheetHeader.displayName = 'SheetHeader';

export type SheetFooterProps = React.HTMLAttributes<HTMLDivElement>;

/** Sits at the bottom of the sheet. */
export const SheetFooter = React.forwardRef<HTMLDivElement, SheetFooterProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pa-sheet-footer', className)} {...props} />
));
SheetFooter.displayName = 'SheetFooter';

export type SheetTitleProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>;

export const SheetTitle = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Title>, SheetTitleProps>(
  ({ className, ...props }, ref) => <SheetPrimitive.Title ref={ref} className={cn('pa-h4', className)} {...props} />,
);
SheetTitle.displayName = 'SheetTitle';

export type SheetDescriptionProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>;

export const SheetDescription = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Description>, SheetDescriptionProps>(
  ({ className, ...props }, ref) => <SheetPrimitive.Description ref={ref} className={cn('pa-caption', className)} {...props} />,
);
SheetDescription.displayName = 'SheetDescription';
