import { Button } from '@/components/ui/button';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { DemoMeta } from '../types';
import { stayOpen, useDemoOpen, useStage } from './support/overlay-stage';

export const meta: DemoMeta = { name: 'Popover', group: 'Overlays', height: 230 };

/** Shown open; the trigger toggles it. */
export default function PopoverDemo() {
  const [stage, setStage] = useStage();
  const { open, onOpenChange, onOpenAutoFocus } = useDemoOpen();
  return (
    <div ref={setStage} style={{ position: 'relative', minHeight: 210 }}>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="secondary">Share album</Button>
        </PopoverTrigger>
        <PopoverContent container={stage} aria-label="Share album" onOpenAutoFocus={onOpenAutoFocus} {...stayOpen(stage)}>
          <b>Private link</b>
          <p className="pa-caption" style={{ margin: '4px 0 12px' }}>Anyone with the link can view.</p>
          <div className="pa-row" style={{ flexWrap: 'nowrap' }}>
            <input
              className="pa-input"
              type="text"
              aria-label="Share link"
              value="studio.com/a/w8k2"
              readOnly
              style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}
            />
            <PopoverClose asChild>
              <Button size="sm">Copy</Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
