import '@/styles/extra/hscroll.css';
import '@/styles/extra/tabs.css';
import * as React from 'react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { cn } from '@/lib/cn';
import { useScrollEdges } from '@/lib/use-scroll-edges';

export type TabsProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>;

/** The selected value, so kept panels can hide themselves from assistive tech while inactive. */
const TabsValueContext = React.createContext<string | undefined>(undefined);

/** Index-card tabs. Controlled with `value`/`onValueChange` or uncontrolled with `defaultValue`. */
export const Tabs = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Root>, TabsProps>(
  ({ className, value, defaultValue, onValueChange, ...props }, ref) => {
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
    return (
      <TabsValueContext.Provider value={value ?? uncontrolled}>
        <TabsPrimitive.Root
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          onValueChange={(next) => {
            setUncontrolled(next);
            onValueChange?.(next);
          }}
          className={cn('pa-tabs-root', className)}
          {...props}
        />
      </TabsValueContext.Provider>
    );
  },
);
Tabs.displayName = 'Tabs';

export type TabsListProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>;

/**
 * The deep-wood rule the tabs stand on (`role="tablist"`). Give it an `aria-label`. When the tabs do not fit
 * (a phone) the row scrolls sideways, the side with more tabs fades out, and the selected tab scrolls into view.
 */
export const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, ...props }, ref) => {
    const scrollRef = useScrollEdges(ref, '[role="tab"][data-state="active"]');
    return <TabsPrimitive.List ref={scrollRef} className={cn('pa-tabs pa-hscroll', className)} {...props} />;
  },
);
TabsList.displayName = 'TabsList';

export type TabsTriggerProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>;

/** One index card. Radix sets `aria-selected`; the selected card is taller and deep wood. */
export const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ className, ...props }, ref) => <TabsPrimitive.Trigger ref={ref} className={cn('pa-tab', className)} {...props} />,
);
TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
  /**
   * Keep every panel mounted in one shared cell (inactive ones hidden), so the panel area is as tall as the tallest
   * panel and switching tabs never moves what sits below. Default `true`; `false` mounts only the selected panel.
   */
  keepHeight?: boolean;
}

/** The panel for one tab (`role="tabpanel"`). */
export const TabsContent = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Content>, TabsContentProps>(
  ({ className, keepHeight = true, forceMount, ...props }, ref) => {
    const selected = React.useContext(TabsValueContext);
    // A kept panel that is not selected is hidden with CSS (visibility) and here for assistive tech.
    const hidden = keepHeight && selected !== undefined && selected !== props.value;
    return (
      <TabsPrimitive.Content
        ref={ref}
        forceMount={keepHeight ? true : forceMount}
        data-keep-height={keepHeight ? '' : undefined}
        aria-hidden={hidden || undefined}
        tabIndex={hidden ? -1 : undefined}
        className={cn('pa-tabs-content', className)}
        {...props}
      />
    );
  },
);
TabsContent.displayName = 'TabsContent';
