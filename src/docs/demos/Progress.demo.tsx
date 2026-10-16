import * as React from 'react';
import { Progress } from '@/components/ui/progress';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Progress', group: 'Feedback', height: 170 };

function Upload({ name, value }: { name: string; value: number }) {
  const id = React.useId();
  return (
    <div>
      <div className="pa-row" style={{ justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
        <span id={id}>{name}</span>
        <b>{value === 100 ? 'Done · 100%' : `${value}%`}</b>
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
    </div>
  );
}
