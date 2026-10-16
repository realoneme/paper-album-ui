import { Check, Clock, Info, Star, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Badge', group: 'Feedback', height: 130 };

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
    </div>
  );
}
