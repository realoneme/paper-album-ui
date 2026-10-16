import '@/styles/extra/item.css';
import * as React from 'react';
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const itemVariants = cva('pa-item', {
  variants: { variant: { default: '', dashed: 'dashed' } },
  defaultVariants: { variant: 'default' },
});

export interface ItemProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof itemVariants> {
  /** Render the child element (for example a link) with item styling. */
  asChild?: boolean;
}

/** A list row: media, title, description and one trailing action. `dashed` invites adding a new item. */
export const Item = React.forwardRef<HTMLDivElement, ItemProps>(({ className, variant, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot.Root : 'div';
  return <Comp ref={ref} className={cn(itemVariants({ variant }), className)} {...props} />;
});
Item.displayName = 'Item';

export interface ItemMediaProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** `icon` centres a Lucide icon on a muted tile; `image` (default) is for a photo or placeholder. */
  variant?: 'image' | 'icon';
}
export const ItemMedia = React.forwardRef<HTMLSpanElement, ItemMediaProps>(
  ({ className, variant = 'image', ...props }, ref) => (
    <span ref={ref} className={cn('pa-item-media', variant === 'icon' && 'icon', className)} {...props} />
  ),
);
ItemMedia.displayName = 'ItemMedia';

export type ItemContentProps = React.HTMLAttributes<HTMLDivElement>;
export const ItemContent = React.forwardRef<HTMLDivElement, ItemContentProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pa-item-body', className)} {...props} />
));
ItemContent.displayName = 'ItemContent';

export type ItemTitleProps = React.HTMLAttributes<HTMLDivElement>;
export const ItemTitle = React.forwardRef<HTMLDivElement, ItemTitleProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pa-item-title', className)} {...props} />
));
ItemTitle.displayName = 'ItemTitle';

export type ItemDescriptionProps = React.HTMLAttributes<HTMLDivElement>;
export const ItemDescription = React.forwardRef<HTMLDivElement, ItemDescriptionProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pa-item-desc', className)} {...props} />
));
ItemDescription.displayName = 'ItemDescription';

export type ItemActionsProps = React.HTMLAttributes<HTMLDivElement>;
export const ItemActions = React.forwardRef<HTMLDivElement, ItemActionsProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pa-item-actions', className)} {...props} />
));
ItemActions.displayName = 'ItemActions';
