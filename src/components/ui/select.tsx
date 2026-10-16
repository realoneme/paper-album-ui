import '@/styles/extra/select.css';
import * as React from 'react';
import { Select as SelectPrimitive } from 'radix-ui';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/cn';

/** A custom listbox for short option lists with groups. Use NativeSelect for long lists or phones. */
export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export type SelectProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>;
export type SelectTriggerProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>;

/** The paper key that shows the current value and opens the list. Label it with <Label htmlFor> or aria-label. */
export const SelectTrigger = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Trigger>, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger ref={ref} className={cn('pa-trigger', className)} {...props}>
      {children}
      <SelectPrimitive.Icon className="pa-select-icon">
        <ChevronDown className="pa-i" aria-hidden />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  ),
);
SelectTrigger.displayName = 'SelectTrigger';

export type SelectContentProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>;

/** The top sheet holding the options. Positioned under the trigger (`position="popper"`) by default. */
export const SelectContent = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Content>, SelectContentProps>(
  ({ className, children, position = 'popper', sideOffset = 8, ...props }, ref) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn('pa-pop pa-menu pa-select-content', className)}
        position={position}
        sideOffset={position === 'popper' ? sideOffset : undefined}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="pa-select-scroll">
          <ChevronUp className="pa-i sm" aria-hidden />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="pa-select-scroll">
          <ChevronDown className="pa-i sm" aria-hidden />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  ),
);
SelectContent.displayName = 'SelectContent';

export type SelectLabelProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>;

/** A small-caps group heading. */
export const SelectLabel = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Label>, SelectLabelProps>(
  ({ className, ...props }, ref) => <SelectPrimitive.Label ref={ref} className={cn('pa-grp', className)} {...props} />,
);
SelectLabel.displayName = 'SelectLabel';

export type SelectItemProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>;

/** One option; the chosen one shows a check, so the state is not colour-only. */
export const SelectItem = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Item>, SelectItemProps>(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item ref={ref} className={cn('pa-mi', className)} {...props}>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="end">
        <SelectPrimitive.ItemIndicator>
          <Check className="pa-i sm" aria-hidden />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  ),
);
SelectItem.displayName = 'SelectItem';

export type SelectSeparatorProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>;

export const SelectSeparator = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Separator>, SelectSeparatorProps>(
  ({ className, ...props }, ref) => <SelectPrimitive.Separator ref={ref} className={cn('pa-sep', className)} {...props} />,
);
SelectSeparator.displayName = 'SelectSeparator';
