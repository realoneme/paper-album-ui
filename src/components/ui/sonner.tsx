import '@/styles/extra/sonner.css';
import * as React from 'react';
import { Toaster as Sonner, toast, type ToasterProps as SonnerProps } from 'sonner';
import { AlertTriangle, Check, Info, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/cn';

export { toast };

export type ToastTone = 'success' | 'error' | 'warning' | 'info';

/** Class names shared by the live Toaster and the static ToastPreview, so both render the same paper. */
export const toastClassNames = {
  toast: 'pa-pop pa-toast',
  icon: 'pa-toast-icon',
  content: 'pa-toast-content',
  title: 'pa-toast-title',
  description: 'pa-toast-desc',
  actionButton: 'pa-btn pa-btn-secondary pa-btn-sm',
  cancelButton: 'pa-btn pa-btn-ghost pa-btn-sm',
  closeButton: 'pa-toast-close',
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
} as const;

export const toastIcons: Record<ToastTone, React.ReactNode> = {
  success: <Check className="pa-i" aria-hidden />,
  error: <AlertTriangle className="pa-i" aria-hidden />,
  warning: <AlertTriangle className="pa-i" aria-hidden />,
  info: <Info className="pa-i" aria-hidden />,
};

/** Where the stack sits on screen. */
export type ToasterPosition = NonNullable<SonnerProps['position']>;

/** All six positions, in reading order (top row, then bottom row). */
export const toasterPositions: readonly ToasterPosition[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const;

export interface ToasterProps extends SonnerProps {
  /** Corner or edge the toasts stack from. Defaults to `bottom-right`, away from primary actions. */
  position?: ToasterPosition;
}

/**
 * Mount once near the root (it is `position: fixed`); call `toast.success(...)`, `toast.error(...)` etc.
 * anywhere. `position` picks one of six spots; `duration` (ms, default 4000) applies to every toast.
 */
export const Toaster = React.forwardRef<HTMLElement, ToasterProps>(
  ({ toastOptions, icons, className, position = 'bottom-right', ...props }, ref) => (
    <Sonner
      ref={ref}
      className={cn('pa-toaster', className)}
      position={position}
      gap={14}
      icons={{
        ...toastIcons,
        loading: <Loader2 className="pa-i" aria-hidden />,
        close: <X className="pa-i sm" aria-hidden />,
        ...icons,
      }}
      toastOptions={{
        ...toastOptions,
        unstyled: true,
        classNames: { ...toastClassNames, ...toastOptions?.classNames },
      }}
      {...props}
    />
  ),
);
Toaster.displayName = 'Toaster';

export interface ToastPreviewProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: ToastTone;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** A trailing action such as <Button size="sm" variant="secondary">Undo</Button>. */
  action?: React.ReactNode;
}

/** A static toast with the same markup and classes the Toaster renders; for docs and empty states. */
export const ToastPreview = React.forwardRef<HTMLDivElement, ToastPreviewProps>(
  ({ tone = 'success', title, description, action, className, role, ...props }, ref) => (
    <div
      ref={ref}
      role={role ?? (tone === 'error' ? 'alert' : 'status')}
      data-type={tone}
      className={cn(toastClassNames.toast, toastClassNames[tone], className)}
      {...props}
    >
      <span className={toastClassNames.icon} aria-hidden>{toastIcons[tone]}</span>
      <div className={toastClassNames.content}>
        <div className={toastClassNames.title}>{title}</div>
        {description ? <div className={toastClassNames.description}>{description}</div> : null}
      </div>
      {action}
    </div>
  ),
);
ToastPreview.displayName = 'ToastPreview';
