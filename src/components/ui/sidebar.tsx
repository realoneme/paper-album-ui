import '@/styles/extra/sidebar.css';
import * as React from 'react';
import { Collapsible as CollapsiblePrimitive, Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown, PanelLeft } from 'lucide-react';
import { cn } from '@/lib/cn';

/* ------------------------------------------------------------------ provider */

interface SidebarContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  sidebarId: string;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

/** Read the sidebar state. Returns `null` outside a SidebarProvider. */
export function useSidebar() {
  return React.useContext(SidebarContext);
}

export interface SidebarProviderProps extends React.ComponentPropsWithoutRef<'div'> {
  /** Uncontrolled initial state. */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * The app shell (`pa-shell`): the sidebar beside its inset. Optional — a Sidebar without a
 * provider is always open; with one, a SidebarTrigger can hide it (offcanvas).
 */
export const SidebarProvider = React.forwardRef<HTMLDivElement, SidebarProviderProps>(
  ({ className, defaultOpen = true, open: openProp, onOpenChange, children, ...props }, ref) => {
    const [openState, setOpenState] = React.useState(defaultOpen);
    const open = openProp ?? openState;
    const sidebarId = React.useId();
    const setOpen = React.useCallback(
      (next: boolean) => {
        if (openProp === undefined) setOpenState(next);
        onOpenChange?.(next);
      },
      [openProp, onOpenChange],
    );
    const value = React.useMemo<SidebarContextValue>(
      () => ({ open, setOpen, toggleSidebar: () => setOpen(!open), sidebarId }),
      [open, setOpen, sidebarId],
    );
    return (
      <SidebarContext.Provider value={value}>
        <div ref={ref} data-state={open ? 'expanded' : 'collapsed'} className={cn('pa-shell', className)} {...props}>
          {children}
        </div>
      </SidebarContext.Provider>
    );
  },
);
SidebarProvider.displayName = 'SidebarProvider';

/* ------------------------------------------------------------------ frame */

export interface SidebarProps extends React.ComponentPropsWithoutRef<'aside'> {
  /** Landmark name, for example the studio name. Required: the page may have other complementary regions. */
  'aria-label': string;
  /** `offcanvas` hides the whole sidebar when the provider is collapsed; `none` keeps it fixed. */
  collapsible?: 'offcanvas' | 'none';
}

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, collapsible = 'offcanvas', id, ...props }, ref) => {
    const ctx = useSidebar();
    return (
      <aside
        ref={ref}
        id={id ?? ctx?.sidebarId}
        data-collapsible={collapsible}
        data-state={ctx && !ctx.open ? 'collapsed' : 'expanded'}
        className={cn('pa-sidebar', className)}
        {...props}
      />
    );
  },
);
Sidebar.displayName = 'Sidebar';

export type SidebarTriggerProps = React.ComponentPropsWithoutRef<'button'>;

/** Show or hide the sidebar. Must be inside a SidebarProvider. */
export const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className, onClick, 'aria-label': ariaLabel = 'Toggle sidebar', ...props }, ref) => {
    const ctx = useSidebar();
    return (
      <button
        ref={ref}
        type="button"
        aria-label={ariaLabel}
        aria-expanded={ctx?.open ?? true}
        aria-controls={ctx?.sidebarId}
        className={cn('pa-btn pa-btn-ghost pa-btn-icon', className)}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) ctx?.toggleSidebar();
        }}
        {...props}
      >
        <PanelLeft className="pa-i" aria-hidden />
      </button>
    );
  },
);
SidebarTrigger.displayName = 'SidebarTrigger';

export type SidebarHeaderProps = React.ComponentPropsWithoutRef<'div'>;

/** Brand row. Put a `<span className="mark" aria-hidden>` monogram before the name. */
export const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('brand', className)} {...props} />,
);
SidebarHeader.displayName = 'SidebarHeader';

export type SidebarContentProps = React.ComponentPropsWithoutRef<'div'>;

export const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('pa-sidebar-content', className)} {...props} />,
);
SidebarContent.displayName = 'SidebarContent';

export type SidebarFooterProps = React.ComponentPropsWithoutRef<'div'>;

export const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('pa-sidebar-footer', className)} {...props} />,
);
SidebarFooter.displayName = 'SidebarFooter';

export type SidebarInsetProps = React.ComponentPropsWithoutRef<'main'>;

/** The content area beside the sidebar (`main`). */
export const SidebarInset = React.forwardRef<HTMLElement, SidebarInsetProps>(
  ({ className, ...props }, ref) => <main ref={ref} className={cn('pa-sidebar-inset', className)} {...props} />,
);
SidebarInset.displayName = 'SidebarInset';

/* ------------------------------------------------------------------ groups */

interface SidebarGroupContextValue {
  collapsible: boolean;
  labelId: string;
}
const SidebarGroupContext = React.createContext<SidebarGroupContextValue>({ collapsible: false, labelId: '' });

export interface SidebarGroupProps extends React.ComponentPropsWithoutRef<'div'> {
  /** Let the label open and close the group. */
  collapsible?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** A labelled set of menu items (`role="group"`, named by its SidebarGroupLabel). */
export const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, collapsible = false, defaultOpen = true, open, onOpenChange, ...props }, ref) => {
    const labelId = React.useId();
    const ctx = React.useMemo(() => ({ collapsible, labelId }), [collapsible, labelId]);
    const group = <div ref={ref} role="group" aria-labelledby={labelId} className={cn('pa-sidebar-group', className)} {...props} />;
    return (
      <SidebarGroupContext.Provider value={ctx}>
        {collapsible ? (
          <CollapsiblePrimitive.Root asChild defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
            {group}
          </CollapsiblePrimitive.Root>
        ) : (
          group
        )}
      </SidebarGroupContext.Provider>
    );
  },
);
SidebarGroup.displayName = 'SidebarGroup';

export type SidebarGroupLabelProps = React.ComponentPropsWithoutRef<'span'>;

/** Small-caps group label; in a collapsible group it becomes the toggle button. */
export const SidebarGroupLabel = React.forwardRef<HTMLSpanElement, SidebarGroupLabelProps>(
  ({ className, children, ...props }, ref) => {
    const { collapsible, labelId } = React.useContext(SidebarGroupContext);
    if (collapsible) {
      return (
        <CollapsiblePrimitive.Trigger className={cn('grp', className)} id={labelId}>
          <span ref={ref} {...props}>{children}</span>
          <ChevronDown className="pa-i sm" aria-hidden />
        </CollapsiblePrimitive.Trigger>
      );
    }
    return (
      <span ref={ref} id={labelId || undefined} className={cn('grp', className)} {...props}>
        {children}
      </span>
    );
  },
);
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

export type SidebarGroupContentProps = React.ComponentPropsWithoutRef<'div'>;

/** Wraps the group's menu; it is what opens and closes in a collapsible group. */
export const SidebarGroupContent = React.forwardRef<HTMLDivElement, SidebarGroupContentProps>(
  ({ className, ...props }, ref) => {
    const { collapsible } = React.useContext(SidebarGroupContext);
    if (collapsible) return <CollapsiblePrimitive.Content ref={ref} className={cn('pa-sidebar-group-content', className)} {...props} />;
    return <div ref={ref} className={cn('pa-sidebar-group-content', className)} {...props} />;
  },
);
SidebarGroupContent.displayName = 'SidebarGroupContent';

/* ------------------------------------------------------------------ menu */

export type SidebarMenuProps = React.ComponentPropsWithoutRef<'ul'>;

export const SidebarMenu = React.forwardRef<HTMLUListElement, SidebarMenuProps>(
  ({ className, ...props }, ref) => <ul ref={ref} className={cn('pa-sidebar-menu', className)} {...props} />,
);
SidebarMenu.displayName = 'SidebarMenu';

export type SidebarMenuItemProps = React.ComponentPropsWithoutRef<'li'>;

export const SidebarMenuItem = React.forwardRef<HTMLLIElement, SidebarMenuItemProps>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn('pa-sidebar-item', className)} {...props} />,
);
SidebarMenuItem.displayName = 'SidebarMenuItem';

export interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render the child (usually a link) with menu-button styling. */
  asChild?: boolean;
  /** The current page: raised paper and `aria-current="page"`. */
  isActive?: boolean;
}

/** A 40px menu row: Lucide icon, label, optional SidebarMenuBadge. */
export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, asChild = false, isActive = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : 'button';
    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : (type ?? 'button')}
        data-active={isActive}
        aria-current={isActive ? 'page' : undefined}
        className={cn('pa-sidebar-btn', className)}
        {...props}
      />
    );
  },
);
SidebarMenuButton.displayName = 'SidebarMenuButton';

export const sidebarMenuBadgeVariants = cva('pa-sidebar-badge', {
  variants: { variant: { count: '', seal: 'pa-badge pa-badge-seal' } },
  defaultVariants: { variant: 'count' },
});

export interface SidebarMenuBadgeProps extends React.ComponentPropsWithoutRef<'span'>, VariantProps<typeof sidebarMenuBadgeVariants> {}

/** A count at the end of a row; `seal` for something that needs attention (new bookings). */
export const SidebarMenuBadge = React.forwardRef<HTMLSpanElement, SidebarMenuBadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(sidebarMenuBadgeVariants({ variant }), className)} {...props} />
  ),
);
SidebarMenuBadge.displayName = 'SidebarMenuBadge';
