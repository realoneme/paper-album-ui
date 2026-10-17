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

const FLIP_VARS = ['--from-x', '--from-y', '--from-sx', '--from-sy', '--from-radius'] as const;

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** The Radix trigger that controls this content (it carries aria-controls={content.id} while open). */
function findTrigger(content: HTMLElement): HTMLElement | null {
  const id = content.id;
  if (!id) return null;
  for (const el of Array.from(content.ownerDocument.querySelectorAll<HTMLElement>('[aria-controls]'))) {
    if (el !== content && el.getAttribute('aria-controls') === id) return el;
  }
  return null;
}

/** Writes the FLIP start (and end, when closing) transform from the trigger rect onto the content. */
function applyFlip(content: HTMLElement, trigger: HTMLElement | null, box: Box) {
  const t = trigger?.getBoundingClientRect();
  if (!trigger || !t || t.width <= 0 || t.height <= 0 || box.width <= 0 || box.height <= 0) {
    delete content.dataset.from;
    for (const name of FLIP_VARS) content.style.removeProperty(name);
    return;
  }
  const sx = t.width / box.width;
  const sy = t.height / box.height;
  const corner = getComputedStyle(trigger);
  const radius = Number.parseFloat(corner.borderTopLeftRadius || corner.borderRadius) || 0;
  const round = (n: number) => Math.round(n * 1000) / 1000;
  content.style.setProperty('--from-x', `${round(t.left + t.width / 2 - (box.left + box.width / 2))}px`);
  content.style.setProperty('--from-y', `${round(t.top + t.height / 2 - (box.top + box.height / 2))}px`);
  content.style.setProperty('--from-sx', String(round(sx)));
  content.style.setProperty('--from-sy', String(round(sy)));
  // Scaled, the box would distort its own radius; pre-divide so it reads as the button's corner.
  content.style.setProperty('--from-radius', `${round(radius / sx)}px / ${round(radius / sy)}px`);
  content.dataset.from = 'trigger';
}

/**
 * FLIP for modal-type content (`pa-grow`): on open it measures its final rect and the trigger's rect and
 * sets --from-x/-y/-sx/-sy/-radius so the enter keyframe grows it out of the button; on close it re-reads
 * the trigger so the exit keyframe shrinks it back in. Without a trigger it scales and fades from centre.
 * Returns a ref to put on the Radix Content (merged with the forwarded ref).
 */
export function useGrowFromTrigger<T extends HTMLElement>(forwarded: React.ForwardedRef<T>) {
  const [node, setNode] = React.useState<T | null>(null);
  const ref = React.useCallback(
    (el: T | null) => {
      setNode(el);
      if (typeof forwarded === 'function') forwarded(el);
      else if (forwarded) forwarded.current = el;
    },
    [forwarded],
  );
  React.useLayoutEffect(() => {
    if (!node) return undefined;
    let box: Box | null = null;
    // Radix drops aria-controls once closed, so keep the trigger found while open.
    let trigger: HTMLElement | null = null;
    const sync = () => {
      if (node.dataset.state === 'open') {
        trigger = findTrigger(node);
        // Measure the resting rect, not a frame of the running keyframe.
        const previous = node.style.animation;
        node.style.animation = 'none';
        const r = node.getBoundingClientRect();
        node.style.animation = previous;
        box = { left: r.left, top: r.top, width: r.width, height: r.height };
      }
      if (box) applyFlip(node, trigger?.isConnected ? trigger : null, box);
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(node, { attributes: true, attributeFilter: ['data-state'] });
    return () => observer.disconnect();
  }, [node]);
  return ref;
}

export type DialogOverlayProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>;

/** The dimmed backdrop. Radix renders it only for modal dialogs. */
export const DialogOverlay = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Overlay>, DialogOverlayProps>(
  ({ className, ...props }, ref) => <DialogPrimitive.Overlay ref={ref} className={cn('pa-backdrop pa-fade', className)} {...props} />,
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

/**
 * The dialog sheet, with backdrop and a labelled close button. Always include a DialogTitle.
 * It grows out of its trigger on open and shrinks back into it on close (see useGrowFromTrigger).
 */
export const DialogContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, DialogContentProps>(
  ({ className, children, container, showCloseButton = true, closeLabel = 'Close', ...props }, ref) => {
    const growRef = useGrowFromTrigger(ref);
    return (
      <DialogPortal container={container}>
        <DialogOverlay className={cn(!container && 'pa-fixed')} />
        <DialogPrimitive.Content ref={growRef} className={cn('pa-pop pa-dialog pa-grow', !container && 'pa-fixed', className)} {...props}>
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close className="pa-close" aria-label={closeLabel}>
              <X className="pa-i" aria-hidden />
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    );
  },
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
