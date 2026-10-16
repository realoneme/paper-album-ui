import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Resizable', group: 'Layout & navigation', height: 240 };

export default function ResizableDemo() {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={32} minSize={20}>
        <b>Albums</b>
        <div className="pa-col pa-muted" style={{ gap: 6, marginTop: 10, fontSize: 14 }}>
          <span>Winter in Hokkaido</span>
          <span>Lisbon mornings</span>
        </div>
      </ResizablePanel>
      <ResizableHandle aria-label="Resize panels" />
      <ResizablePanel defaultSize={68} bare>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={60} minSize={30}>
            <b>Preview</b>
            <div className="ph-1 pa-ratio" style={{ height: 56, marginTop: 10 }} aria-hidden />
          </ResizablePanel>
          <ResizableHandle aria-label="Resize preview" />
          <ResizablePanel defaultSize={40} minSize={20}>
            <b>Notes</b> <span className="pa-muted">Retouch skin tones on 4 and 7.</span>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
