import { ChevronRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Button', group: 'Actions' };

export default function ButtonDemo() {
  return (
    <div className="pa-col">
      <div className="pa-row">
        <Button>View albums</Button>
        <Button variant="secondary">Read the journal</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="pa-row">
        <Button variant="seal" size="lg">Book a session</Button>
        <Button variant="destructive"><Trash2 className="pa-i" aria-hidden />Delete</Button>
        <Button variant="secondary" size="sm">Small</Button>
        <Button variant="secondary" size="icon" aria-label="Next photo"><ChevronRight className="pa-i" aria-hidden /></Button>
        <Button disabled>Sold out</Button>
      </div>
    </div>
  );
}
