import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Item', group: 'Data display', height: 250 };

export default function ItemDemo() {
  return (
    <div className="pa-stack" style={{ maxWidth: 520, gap: 10 }}>
      <Item>
        <ItemMedia className="ph-2" aria-hidden />
        <ItemContent>
          <ItemTitle>Lisbon Mornings</ItemTitle>
          <ItemDescription>18 photos · updated 2 days ago</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="secondary" size="sm" aria-label="Open Lisbon Mornings">Open</Button>
        </ItemActions>
      </Item>
      <Item>
        <ItemMedia className="ph-3" aria-hidden />
        <ItemContent>
          <ItemTitle>Forest Notes</ItemTitle>
          <ItemDescription>32 photos</ItemDescription>
        </ItemContent>
        <ItemActions>
          <span className="pa-badge pa-badge-secondary">Draft</span>
        </ItemActions>
      </Item>
      <Item variant="dashed">
        <ItemMedia variant="icon" aria-hidden>
          <Plus className="pa-i" aria-hidden />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>New album</ItemTitle>
          <ItemDescription>Start from a folder or drag photos in</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  );
}
