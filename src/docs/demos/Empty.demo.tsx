import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Empty', group: 'Feedback', height: 260 };

export default function EmptyDemo() {
  return (
    <div className="pa-panel" style={{ maxWidth: 420 }}>
      <Empty>
        <EmptyMedia />
        <EmptyTitle>No photos yet</EmptyTitle>
        <EmptyDescription>Drop images here to fill this album.</EmptyDescription>
        <EmptyContent>
          <Button>Upload photos</Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
