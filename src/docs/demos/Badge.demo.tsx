import { Check, Clock, Info, Star, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Badge', group: 'Feedback', height: 250 };

const sizes = ['default', 'sm', 'xs'] as const;

export default function BadgeDemo() {
  return (
    <div className="pa-col">
      <div className="pa-row">
        <Badge>Published</Badge>
        <Badge variant="secondary">Draft</Badge>
        <Badge variant="outline">Film</Badge>
        <Badge variant="seal">
          <Star className="pa-i sm" aria-hidden style={{ fill: 'currentColor', stroke: 'none', width: 12, height: 12 }} />
          Featured
        </Badge>
        <Badge variant="wood">On sale</Badge>
      </div>
      <div className="pa-row">
        <Badge variant="success"><Check className="pa-i sm" aria-hidden />Paid</Badge>
        <Badge variant="warning"><Clock className="pa-i sm" aria-hidden />Pending</Badge>
        <Badge variant="info"><Info className="pa-i sm" aria-hidden />New</Badge>
        <Badge variant="destructive"><X className="pa-i sm" aria-hidden />Refunded</Badge>
      </div>
      {sizes.map((size) => (
        <div key={size} className="pa-row" data-size={size}>
          <span className="pa-muted" style={{ width: 56, fontSize: 12 }}>{size}</span>
          <Badge size={size}>12 prints</Badge>
          <Badge size={size} variant="success"><Check className="pa-i sm" aria-hidden />Shipped</Badge>
          <Badge size={size} variant="warning"><Clock className="pa-i sm" aria-hidden />In review</Badge>
          <Badge size={size} variant="outline">Film</Badge>
        </div>
      ))}
    </div>
  );
}
