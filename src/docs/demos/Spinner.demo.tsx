import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Spinner', group: 'Feedback', height: 100 };

export default function SpinnerDemo() {
  return (
    <div className="pa-row" style={{ gap: 24 }}>
      <Spinner label="Loading" />
      <Button disabled aria-busy style={{ opacity: 1, cursor: 'progress' }}>
        <Spinner tone="current" size="sm" aria-hidden />
        Uploading 12 photos
      </Button>
    </div>
  );
}
