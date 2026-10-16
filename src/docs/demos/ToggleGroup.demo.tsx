import { useState } from 'react';
import { LayoutDashboard, LayoutGrid, List } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'ToggleGroup', group: 'Actions', height: 80 };

export default function ToggleGroupDemo() {
  const [layout, setLayout] = useState('grid');
  return (
    <ToggleGroup
      type="single"
      aria-label="Gallery layout"
      value={layout}
      onValueChange={(next) => next && setLayout(next)}
    >
      <ToggleGroupItem value="grid"><LayoutGrid className="pa-i sm" aria-hidden />Grid</ToggleGroupItem>
      <ToggleGroupItem value="list"><List className="pa-i sm" aria-hidden />List</ToggleGroupItem>
      <ToggleGroupItem value="masonry"><LayoutDashboard className="pa-i sm" aria-hidden />Masonry</ToggleGroupItem>
    </ToggleGroup>
  );
}
