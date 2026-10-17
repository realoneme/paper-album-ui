import * as React from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Progress', group: 'Feedback', height: 250 };

function Upload({ name, value }: { name: string; value: number | null }) {
  const id = React.useId();
  const status = value === null ? 'Preparing…' : value === 100 ? 'Done · 100%' : `${value}%`;
  return (
    <div>
      <div className="pa-row" style={{ justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
        <span id={id}>{name}</span>
        <b>{status}</b>
      </div>
      <Progress aria-labelledby={id} value={value} />
    </div>
  );
}

export default function ProgressDemo() {
  const [value, setValue] = React.useState(64);
  React.useEffect(() => {
    if (value >= 100) return;
    const t = window.setTimeout(() => setValue((v) => Math.min(100, v + 4)), 600);
    return () => window.clearTimeout(t);
  }, [value]);
  return (
    <div className="pa-panel pa-stack" style={{ maxWidth: 420 }}>
      <Upload name="IMG_2033.jpg" value={100} />
      <Upload name="IMG_2034.jpg" value={value} />
      <Upload name="Album export" value={null} />
      <div>
        <Button variant="secondary" size="sm" onClick={() => setValue(8)} disabled={value < 100}>
          <RotateCcw className="pa-i sm" aria-hidden />
          Upload again
        </Button>
      </div>
    </div>
  );
}
