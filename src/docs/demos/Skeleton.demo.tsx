import { Skeleton } from '@/components/ui/skeleton';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Skeleton', group: 'Feedback', height: 150 };

export default function SkeletonDemo() {
  return (
    <div className="pa-panel" style={{ maxWidth: 420 }}>
      <div className="pa-row" role="status" aria-label="Loading album" style={{ flexWrap: 'nowrap', alignItems: 'flex-start', gap: 16 }}>
        <Skeleton style={{ width: 96, height: 110, flex: 'none' }} />
        <div className="pa-stack" style={{ flex: 1, gap: 10, paddingTop: 6 }}>
          <Skeleton style={{ height: 18, width: '80%' }} />
          <Skeleton style={{ height: 12, width: '55%' }} />
          <Skeleton style={{ height: 32, width: '45%', marginTop: 8 }} />
        </div>
      </div>
    </div>
  );
}
