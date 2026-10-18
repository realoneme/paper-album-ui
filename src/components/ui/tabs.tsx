import '@/styles/extra/hscroll.css';
import '@/styles/extra/tabs.css';
import * as React from 'react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { cn } from '@/lib/cn';
import { useScrollEdges } from '@/lib/use-scroll-edges';

export type TabsProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>;

/** Index-card tabs. Controlled with `value`/`onValueChange` or uncontrolled with `defaultValue`. */
export const Tabs = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Root>, TabsProps>(
  ({ className, ...props }, ref) => <TabsPrimitive.Root ref={ref} className={cn('pa-tabs-root', className)} {...props} />,
);
Tabs.displayName = 'Tabs';

export type TabsListProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>;

/**
 * The deep-wood rule the tabs stand on (`role="tablist"`). Give it an `aria-label`. When the tabs do not fit
 * (a phone) the row scrolls sideways, the side with more tabs fades out, and the selected tab scrolls into view.
 */
export const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, onPointerDown, onKeyDown, ...props }, ref) => {
    const scrollRef = useScrollEdges(ref, '[role="tab"][data-state="active"]');
    // Once the reader uses the tabs, a newly selected card is pulled up and springs back (not on first render).
    const [touched, setTouched] = React.useState(false);
    return (
      <TabsPrimitive.List
        ref={scrollRef}
        data-touched={touched ? '' : undefined}
        onPointerDown={(event) => {
          setTouched(true);
          onPointerDown?.(event);
        }}
        onKeyDown={(event) => {
          setTouched(true);
          onKeyDown?.(event);
        }}
        className={cn('pa-tabs pa-hscroll', className)}
        {...props}
      />
    );
  },
);
TabsList.displayName = 'TabsList';

export type TabsTriggerProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>;

/** One index card. Radix sets `aria-selected`; the selected card is taller and deep wood. */
export const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ className, ...props }, ref) => <TabsPrimitive.Trigger ref={ref} className={cn('pa-tab', className)} {...props} />,
);
TabsTrigger.displayName = 'TabsTrigger';

export type TabsContentProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>;

/** The panel for one tab (`role="tabpanel"`). */
export const TabsContent = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Content>, TabsContentProps>(
  ({ className, ...props }, ref) => <TabsPrimitive.Content ref={ref} className={cn('pa-tabs-content', className)} {...props} />,
);
TabsContent.displayName = 'TabsContent';
