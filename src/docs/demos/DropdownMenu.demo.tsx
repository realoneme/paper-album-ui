import * as React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { DemoMeta } from '../types';
import { stayOpen, useDemoOpen, useStage } from './support/overlay-stage';

export const meta: DemoMeta = { name: 'DropdownMenu', group: 'Menus', height: 340 };

/** Shown open (non-modal); the trigger toggles it. */
export default function DropdownMenuDemo() {
  const [stage, setStage] = useStage();
  const { open, onOpenChange, onOpenAutoFocus } = useDemoOpen();
  const [watermark, setWatermark] = React.useState(true);
  const [downloads, setDownloads] = React.useState(false);
  const Chevron = open ? ChevronUp : ChevronDown;
  return (
    <div ref={setStage} style={{ position: 'relative', minHeight: 320 }}>
      <DropdownMenu open={open} onOpenChange={onOpenChange} modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <span className="pa-avatar xs" aria-hidden="true">SN</span>
            [Studio Name]
            <Chevron className="pa-i sm" aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          container={stage}
          align="start"
          style={{ width: 260 }}
          onOpenAutoFocus={onOpenAutoFocus}
          {...stayOpen(stage)}
        >
          <DropdownMenuLabel>My studio</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={watermark} onCheckedChange={setWatermark} onSelect={(e) => e.preventDefault()}>
            Show watermark
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={downloads} onCheckedChange={setDownloads} onSelect={(e) => e.preventDefault()}>
            Allow downloads
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
