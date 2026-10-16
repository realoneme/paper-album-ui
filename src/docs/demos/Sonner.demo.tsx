import { Button } from '@/components/ui/button';
import { Toaster, ToastPreview, toast } from '@/components/ui/sonner';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Sonner', group: 'Feedback', height: 220 };

export default function SonnerDemo() {
  return (
    <div className="pa-stack" style={{ maxWidth: 480, gap: 14 }}>
      <ToastPreview
        title="12 photos uploaded"
        description="Added to “Winter in Hokkaido”."
        action={<Button variant="secondary" size="sm">Undo</Button>}
      />
      <ToastPreview
        tone="error"
        title="Upload failed"
        description="IMG_2041.CR3 is over 80 MB."
        action={<Button variant="secondary" size="sm">Retry</Button>}
      />
      <div className="pa-row">
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            toast.success('12 photos uploaded', {
              description: 'Added to “Winter in Hokkaido”.',
              action: { label: 'Undo', onClick: () => toast.info('Upload undone') },
            })
          }
        >
          Show success
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => toast.error('Upload failed', { description: 'IMG_2041.CR3 is over 80 MB.' })}
        >
          Show error
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => toast.warning('Storage almost full', { description: '92% of 50 GB used (sample data).' })}
        >
          Show warning
        </Button>
        <Button variant="secondary" size="sm" onClick={() => toast.info('Prints ship on Monday')}>
          Show info
        </Button>
      </div>
      <Toaster />
    </div>
  );
}
