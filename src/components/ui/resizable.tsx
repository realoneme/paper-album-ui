import '@/styles/extra/resizable.css';
import * as React from 'react';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
  usePanelGroupContext,
  type ImperativePanelGroupHandle,
  type ImperativePanelHandle,
  type PanelGroupProps,
  type PanelProps,
  type PanelResizeHandleProps,
} from 'react-resizable-panels';
import { cn } from '@/lib/cn';

export type ResizablePanelGroupProps = PanelGroupProps;

/** The framed split. `direction="horizontal"` puts panels side by side. Nested groups lose their own frame. */
export const ResizablePanelGroup = React.forwardRef<ImperativePanelGroupHandle, ResizablePanelGroupProps>(
  ({ className, ...props }, ref) => <PanelGroup ref={ref} className={cn('pa-resizable', className)} {...props} />,
);
ResizablePanelGroup.displayName = 'ResizablePanelGroup';

export type ResizablePanelProps = PanelProps & {
  /** Drop the default `.pane` padding (for example when the panel holds a nested group). */
  bare?: boolean;
};

export const ResizablePanel = React.forwardRef<ImperativePanelHandle, ResizablePanelProps>(
  ({ className, bare = false, ...props }, ref) => <Panel ref={ref} className={cn(!bare && 'pane', className)} {...props} />,
);
ResizablePanel.displayName = 'ResizablePanel';

export type ResizableHandleProps = PanelResizeHandleProps & {
  /** Accessible name for the handle, for example "Resize panels". */
  'aria-label'?: string;
};

/**
 * The draggable crease (`role="separator"`). The library makes it focusable and operable with the
 * arrow keys, Home and End. Its look follows the group's direction.
 */
export function ResizableHandle({ className, ...props }: ResizableHandleProps) {
  const { direction } = usePanelGroupContext();
  const vertical = direction !== 'vertical';
  return (
    <PanelResizeHandle
      className={cn(vertical ? 'pa-handle-v' : 'pa-handle-h', className)}
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
      {...props}
    />
  );
}
ResizableHandle.displayName = 'ResizableHandle';
