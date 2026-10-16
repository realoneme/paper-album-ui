import '@/styles/extra/command.css';
import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { VisuallyHidden } from 'radix-ui';
import { Search } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Dialog, DialogContent, DialogDescription, DialogTitle, type DialogContentProps, type DialogProps } from '@/components/ui/dialog';

export type CommandProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive>;

/** A searchable command palette: a search field over grouped results. Give it a `label`. */
export const Command = React.forwardRef<React.ElementRef<typeof CommandPrimitive>, CommandProps>(
  ({ className, ...props }, ref) => <CommandPrimitive ref={ref} className={cn('pa-pop pa-cmd', className)} {...props} />,
);
Command.displayName = 'Command';

export interface CommandDialogProps extends DialogProps {
  /** Dialog title, visually hidden (default "Command menu"). */
  title?: string;
  /** Dialog description, visually hidden. */
  description?: string;
  /** Portal target for the dialog. */
  container?: DialogContentProps['container'];
  className?: string;
  /** Props for the inner Command (for example `label` or `filter`). */
  commandProps?: CommandProps;
}

/** The palette in a dialog, for a global search shortcut. */
export function CommandDialog({
  title = 'Command menu',
  description = 'Search for an album or an action.',
  container,
  className,
  commandProps,
  children,
  ...props
}: CommandDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent container={container} showCloseButton={false} className={cn('pa-cmd-dialog', className)}>
        <VisuallyHidden.Root>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </VisuallyHidden.Root>
        <Command label={title} {...commandProps}>{children}</Command>
      </DialogContent>
    </Dialog>
  );
}
CommandDialog.displayName = 'CommandDialog';

export type CommandInputProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>;

/** The search field (role="combobox") with its magnifier. */
export const CommandInput = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Input>, CommandInputProps>(
  ({ className, ...props }, ref) => (
    <div className="pa-cmd-input">
      <Search className="pa-i" aria-hidden />
      <CommandPrimitive.Input ref={ref} className={className} {...props} />
    </div>
  ),
);
CommandInput.displayName = 'CommandInput';

export type CommandListProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>;

/** The results (role="listbox"). */
export const CommandList = React.forwardRef<React.ElementRef<typeof CommandPrimitive.List>, CommandListProps>(
  ({ className, ...props }, ref) => <CommandPrimitive.List ref={ref} className={cn('pa-menu pa-cmd-list', className)} {...props} />,
);
CommandList.displayName = 'CommandList';

export type CommandEmptyProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>;

/** Shown when nothing matches; say what was searched and what to try. */
export const CommandEmpty = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Empty>, CommandEmptyProps>(
  ({ className, ...props }, ref) => <CommandPrimitive.Empty ref={ref} className={cn('pa-cmd-empty', className)} {...props} />,
);
CommandEmpty.displayName = 'CommandEmpty';

export type CommandGroupProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>;

/** A titled group of results; the heading uses the small-caps pa-grp style. */
export const CommandGroup = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Group>, CommandGroupProps>(
  ({ className, heading, ...props }, ref) => (
    <CommandPrimitive.Group
      ref={ref}
      className={className}
      heading={heading != null ? <span className="pa-grp pa-cmd-heading">{heading}</span> : undefined}
      {...props}
    />
  ),
);
CommandGroup.displayName = 'CommandGroup';

export type CommandSeparatorProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>;

export const CommandSeparator = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Separator>, CommandSeparatorProps>(
  ({ className, ...props }, ref) => <CommandPrimitive.Separator ref={ref} className={cn('pa-sep', className)} {...props} />,
);
CommandSeparator.displayName = 'CommandSeparator';

export type CommandItemProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>;

/** One result (role="option"). Arrow keys move the selection; Enter runs onSelect. */
export const CommandItem = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Item>, CommandItemProps>(
  ({ className, ...props }, ref) => <CommandPrimitive.Item ref={ref} className={cn('pa-mi', className)} {...props} />,
);
CommandItem.displayName = 'CommandItem';

export type CommandShortcutProps = React.HTMLAttributes<HTMLSpanElement>;

/** Right-aligned meta text (a count, or a key spelled out in words). */
export function CommandShortcut({ className, ...props }: CommandShortcutProps) {
  return <span className={cn('sc', className)} {...props} />;
}
CommandShortcut.displayName = 'CommandShortcut';
