import * as React from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Toaster, ToastPreview, toast, toasterPositions, type ToasterPosition } from '@/components/ui/sonner';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Sonner', group: 'Feedback', height: 300 };

const positionLabels: Record<ToasterPosition, string> = {
  'top-left': 'Top left',
  'top-center': 'Top centre',
  'top-right': 'Top right',
  'bottom-left': 'Bottom left',
  'bottom-center': 'Bottom centre',
  'bottom-right': 'Bottom right',
};

function isPosition(value: string): value is ToasterPosition {
  return (toasterPositions as readonly string[]).includes(value);
}

export default function SonnerDemo() {
  const [position, setPosition] = React.useState<ToasterPosition>('bottom-right');
  // The live Toaster is fixed to the viewport, so render it at page level rather than inside the demo stage.
  const toaster = <Toaster position={position} />;
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
      <label className="pa-field" style={{ maxWidth: 240 }}>
        <span className="pa-label">Toast position</span>
        <NativeSelect
          value={position}
          onChange={(event) => {
            const next = event.target.value;
            if (isPosition(next)) setPosition(next);
          }}
        >
          {toasterPositions.map((p) => (
            <NativeSelectOption key={p} value={p}>{positionLabels[p]}</NativeSelectOption>
          ))}
        </NativeSelect>
      </label>
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
          onClick={() => toast.error('Upload failed', { description: 'IMG_2041.CR3 is over 80 MB.', duration: 8000 })}
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
      {typeof document === 'undefined' ? toaster : createPortal(toaster, document.body)}
    </div>
  );
}
