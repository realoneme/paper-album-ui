import * as React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import type { DemoMeta } from '../types';
import { useStage } from './support/overlay-stage';

export const meta: DemoMeta = { name: 'ContextMenu', group: 'Menus', height: 260 };

const ACTIONS = ['Set as cover', 'Move to…', 'Copy link'];

/**
 * Radix opens a context menu only at the pointer of a real right-click, so the stage starts with a
 * static picture of the open menu (same classes; it highlights on hover like the real one, nothing is pinned).
 * Right-click or long-press the area for the real one.
 */
export default function ContextMenuDemo() {
  const [stage, setStage] = useStage();
  const [preview, setPreview] = React.useState(true);
  return (
    <div ref={setStage} style={{ position: 'relative', maxWidth: 360 }}>
      <ContextMenu modal={false} onOpenChange={(open) => open && setPreview(false)}>
        <ContextMenuTrigger className="pa-context-area">
          <span className="pa-caption" style={{ display: 'block', marginBottom: 12 }}>Right-click a photo</span>
          {preview ? (
            <div className="pa-pop pa-menu" aria-hidden="true" data-testid="context-preview" style={{ width: 200, marginLeft: 40 }}>
              <div className="pa-mi">Set as cover</div>
              <div className="pa-mi">Move to…</div>
              <div className="pa-mi">Copy link</div>
              <hr className="pa-sep" />
              <div className="pa-mi danger">Remove</div>
            </div>
          ) : (
            <span className="pa-photo ph-1 pa-ratio" style={{ width: 160, aspectRatio: '3 / 2' }} aria-hidden="true" />
          )}
        </ContextMenuTrigger>
        <ContextMenuContent container={stage} style={{ width: 200 }}>
          {ACTIONS.map((a) => <ContextMenuItem key={a}>{a}</ContextMenuItem>)}
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">Remove</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
