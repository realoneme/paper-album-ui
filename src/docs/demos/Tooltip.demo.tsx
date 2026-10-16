import * as React from 'react';
import { Download, Heart, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { DemoMeta } from '../types';
import { useStage } from './support/overlay-stage';

export const meta: DemoMeta = { name: 'Tooltip', group: 'Overlays', height: 130 };

const ACTIONS = [
  { label: 'Favorite', tip: 'Add to favorites', Icon: Heart },
  { label: 'Download', tip: 'Download original', Icon: Download },
  { label: 'Share', tip: 'Copy share link', Icon: Share },
];

/**
 * "Download original" is pinned open until the reader points at or tabs into the demo
 * (Radix closes tooltips on page scroll); from then on every button behaves normally.
 */
export default function TooltipDemo() {
  const [stage, setStage] = useStage();
  const [pinned, setPinned] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const release = () => setPinned(false);
  return (
    <div
      ref={setStage}
      className="pa-row"
      style={{ position: 'relative', justifyContent: 'center', paddingTop: 56 }}
      onPointerEnter={release}
      onFocusCapture={release}
    >
      {ACTIONS.map(({ label, tip, Icon }) => {
        const isPinned = label === 'Download';
        return (
          <Tooltip
            key={label}
            {...(isPinned ? { open: pinned || open, onOpenChange: setOpen } : {})}
          >
            <TooltipTrigger asChild>
              <Button variant="secondary" size="icon" aria-label={label}>
                <Icon className="pa-i" aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent container={stage}>{tip}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
