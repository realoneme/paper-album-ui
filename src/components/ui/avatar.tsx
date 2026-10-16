import '@/styles/extra/avatar.css';
import * as React from 'react';
import { Avatar as AvatarPrimitive } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const avatarVariants = cva('pa-avatar', {
  variants: {
    size: { xs: 'xs', sm: 'sm', default: '', lg: 'lg' },
    tone: { default: '', deep: 'deep' },
  },
  defaultVariants: { size: 'default', tone: 'default' },
});

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

/** A round portrait with a paper rim. Falls back to initials on wood (`default`) or deep wood (`deep`). */
export const Avatar = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  ({ className, size, tone, ...props }, ref) => (
    <AvatarPrimitive.Root ref={ref} className={cn(avatarVariants({ size, tone }), className)} {...props} />
  ),
);
Avatar.displayName = 'Avatar';

export type AvatarImageProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>;
export const AvatarImage = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Image>, AvatarImageProps>(
  ({ className, ...props }, ref) => <AvatarPrimitive.Image ref={ref} className={className} {...props} />,
);
AvatarImage.displayName = 'AvatarImage';

export type AvatarFallbackProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>;
/** Initials shown while the image loads or when it fails. */
export const AvatarFallback = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Fallback>, AvatarFallbackProps>(
  ({ className, ...props }, ref) => <AvatarPrimitive.Fallback ref={ref} className={className} {...props} />,
);
AvatarFallback.displayName = 'AvatarFallback';

export type AvatarGroupProps = React.HTMLAttributes<HTMLDivElement>;
/** Overlapping avatars (10px). Give it an `aria-label` such as "Collaborators". */
export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(({ className, role = 'group', ...props }, ref) => (
  <div ref={ref} role={role} className={cn('pa-avatar-group', className)} {...props} />
));
AvatarGroup.displayName = 'AvatarGroup';

export interface AvatarGroupCountProps extends React.HTMLAttributes<HTMLSpanElement>, Pick<VariantProps<typeof avatarVariants>, 'size'> {}
/** The "+4" disc at the end of a group. */
export const AvatarGroupCount = React.forwardRef<HTMLSpanElement, AvatarGroupCountProps>(({ className, size, ...props }, ref) => (
  <span ref={ref} className={cn(avatarVariants({ size }), 'count', className)} {...props} />
));
AvatarGroupCount.displayName = 'AvatarGroupCount';
