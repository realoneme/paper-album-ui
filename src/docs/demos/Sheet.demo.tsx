import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { DemoMeta } from '../types';
import { FakePage, stayOpen, useDemoOpen, useStage } from './support/overlay-stage';

export const meta: DemoMeta = { name: 'Sheet', group: 'Overlays', height: 560 };

/** Shown open and non-modal inside its own stage. Close and reopen it to see it slide in from the edge. */
export default function SheetDemo() {
  const [stage, setStage] = useStage();
  const { open, onOpenChange, onOpenAutoFocus } = useDemoOpen();
  return (
    <div className="pa-stack">
      <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
        <div className="pa-row">
          <SheetTrigger asChild>
            <Button variant="secondary">Photo details</Button>
          </SheetTrigger>
        </div>
        <div ref={setStage} className="pa-stage" style={{ height: 480 }}>
          <FakePage />
          <div className="pa-backdrop pa-fade" data-state={open ? 'open' : 'closed'} aria-hidden="true" />
          <SheetContent container={stage} onOpenAutoFocus={onOpenAutoFocus} {...stayOpen(stage)}>
            <SheetHeader>
              <SheetTitle>Photo details</SheetTitle>
              <SheetDescription>Frame 12 of Winter in Hokkaido.</SheetDescription>
            </SheetHeader>
            <div className="pa-photo ph-2 pa-ratio" style={{ aspectRatio: '16 / 9', margin: '16px 0' }} aria-hidden="true" />
            <table className="pa-table">
              <tbody>
                <tr><td className="pa-muted">Camera</td><td className="num">[Camera model]</td></tr>
                <tr><td className="pa-muted">Exposure</td><td className="num">1/250 · f/5.6</td></tr>
              </tbody>
            </table>
            <SheetFooter>
              <Button style={{ width: '100%' }}>Order a print</Button>
            </SheetFooter>
          </SheetContent>
        </div>
      </Sheet>
    </div>
  );
}
