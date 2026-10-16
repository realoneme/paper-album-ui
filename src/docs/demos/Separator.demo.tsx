import { Separator } from '@/components/ui/separator';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Separator', group: 'Layout & navigation', height: 150 };

export default function SeparatorDemo() {
  return (
    <div className="pa-panel" style={{ maxWidth: 420 }}>
      <b>Winter in Hokkaido</b>
      <Separator />
      <div className="pa-row pa-muted" style={{ fontSize: 14 }}>
        <span>24 photos</span>
        <Separator orientation="vertical" decorative={false} />
        <span>Hokkaido</span>
        <Separator orientation="vertical" decorative={false} />
        <span>2026</span>
      </div>
      <Separator variant="wave" />
    </div>
  );
}
