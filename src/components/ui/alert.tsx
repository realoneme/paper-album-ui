import '@/styles/extra/alert.css';
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, Info, TriangleAlert, X, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

export const alertVariants = cva('pa-alert', {
  variants: {
    /** `default` is a neutral sunken note; tones sit on card paper with a tinted icon disc. */
    variant: { default: '', info: 'info', success: 'success', warning: 'warning', destructive: 'destructive' },
  },
  defaultVariants: { variant: 'default' },
});

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>;

const defaultIcons: Record<AlertVariant, LucideIcon | null> = {
  default: null,
  info: Info,
  success: Check,
  warning: TriangleAlert,
  destructive: X,
};

const defaultRoles: Record<AlertVariant, 'status' | 'alert' | undefined> = {
  default: undefined,
  info: 'status',
  success: 'status',
  warning: 'alert',
  destructive: 'alert',
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  /**
   * Icon inside the round `pa-alert-icon` disc. Each tone has a default (info, check, triangle, cross);
   * pass `null` to hide it.
   */
  icon?: React.ReactNode;
}

/**
 * An inline message in the page. Title + one or two sentences, an icon first. Warning and destructive
 * hang a bookmark ribbon. Role defaults to `status` (info, success) or `alert` (warning, destructive).
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon, role, children, ...props }, ref) => {
    const tone: AlertVariant = variant ?? 'default';
    const DefaultIcon = defaultIcons[tone];
    const iconNode = icon === undefined ? DefaultIcon && <DefaultIcon className="pa-i sm" aria-hidden /> : icon;
    return (
      <div ref={ref} role={role ?? defaultRoles[tone]} className={cn(alertVariants({ variant }), className)} {...props}>
        {iconNode && (
          <span className="pa-alert-icon" aria-hidden>
            {iconNode}
          </span>
        )}
        <div className="pa-alert-body">{children}</div>
      </div>
    );
  },
);
Alert.displayName = 'Alert';

export type AlertTitleProps = React.HTMLAttributes<HTMLDivElement>;

export const AlertTitle = React.forwardRef<HTMLDivElement, AlertTitleProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pa-alert-title', className)} {...props} />
));
AlertTitle.displayName = 'AlertTitle';

export type AlertDescriptionProps = React.HTMLAttributes<HTMLDivElement>;

export const AlertDescription = React.forwardRef<HTMLDivElement, AlertDescriptionProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pa-alert-desc', className)} {...props} />
));
AlertDescription.displayName = 'AlertDescription';
