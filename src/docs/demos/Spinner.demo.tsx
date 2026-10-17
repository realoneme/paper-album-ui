import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Spinner', group: 'Feedback', height: 140 };

export default function SpinnerDemo() {
  return (
    <div className="pa-col" style={{ gap: 20 }}>
      <div className="pa-row" style={{ gap: 24 }}>
        <Spinner label="Loading" size="sm" />
        <Spinner label="Loading album" />
        <Spinner label="Loading prints" tone="primary" size="lg" />
      </div>
      <div className="pa-row" style={{ gap: 12 }}>
        <Button disabled aria-busy style={{ opacity: 1, cursor: 'progress' }}>
          <Spinner tone="current" size="sm" aria-hidden />
          Uploading 12 photos
        </Button>
        <Button variant="secondary" disabled aria-busy style={{ opacity: 1, cursor: 'progress' }}>
          <Spinner tone="current" size="sm" aria-hidden />
          Saving
        </Button>
      </div>
    </div>
  );
}
