import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { DemoMeta } from '../types';
import { FakePage, stayOpen, useDemoOpen, useStage } from './support/overlay-stage';

export const meta: DemoMeta = { name: 'Dialog', group: 'Overlays', height: 500 };

/**
 * Shown open and non-modal inside its own stage, so the docs page stays scrollable and usable.
 * Close it, then press the trigger: the sheet grows out of the button and shrinks back into it.
 */
export default function DialogDemo() {
  const [stage, setStage] = useStage();
  const { open, onOpenChange, onOpenAutoFocus } = useDemoOpen();
  return (
    <div className="pa-stack">
      <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
        <div className="pa-row">
          <DialogTrigger asChild>
            <Button variant="secondary">Edit album</Button>
          </DialogTrigger>
        </div>
        <div ref={setStage} className="pa-stage">
          <FakePage />
          <div className="pa-backdrop pa-fade" data-state={open ? 'open' : 'closed'} aria-hidden="true" />
          <DialogContent container={stage} onOpenAutoFocus={onOpenAutoFocus} {...stayOpen(stage)}>
            <DialogHeader>
              <DialogTitle>Edit album</DialogTitle>
              <DialogDescription>Changes show on the cover pocket right away.</DialogDescription>
            </DialogHeader>
            <label className="pa-field">
              <span className="pa-label">Title</span>
              <input className="pa-input" type="text" defaultValue="Winter in Hokkaido" />
            </label>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button>Save changes</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
}
