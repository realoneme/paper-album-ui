import { useState } from 'react';
import { Info, LayoutGrid, List } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Toggle', group: 'Actions', height: 80 };

export default function ToggleDemo() {
  const [grid, setGrid] = useState(true);
  return (
    <div className="pa-row">
      <Toggle pressed={grid} onPressedChange={setGrid}>
        <LayoutGrid className="pa-i" aria-hidden />Grid
      </Toggle>
      <Toggle>
        <List className="pa-i" aria-hidden />Captions
      </Toggle>
      <Toggle defaultPressed>
        <Info className="pa-i" aria-hidden />EXIF
      </Toggle>
    </div>
  );
}
