import { AspectRatio } from '@/components/ui/aspect-ratio';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'AspectRatio', group: 'Data display', height: 220 };

const frames = [
  { ratio: 16 / 9, label: '16 : 9', flex: 3, ph: 'ph-1' },
  { ratio: 1, label: '1 : 1', flex: 2, ph: 'ph-2' },
  { ratio: 4 / 5, label: '4 : 5', flex: 1.6, ph: 'ph-3' },
];

export default function AspectRatioDemo() {
  return (
    <div className="pa-row" style={{ alignItems: 'flex-end', flexWrap: 'nowrap', maxWidth: 560, gap: 18 }}>
      {frames.map((f) => (
        <figure key={f.label} style={{ flex: f.flex, margin: 0, minWidth: 0 }}>
          <AspectRatio ratio={f.ratio} className={f.ph} aria-hidden />
          <figcaption className="pa-caption" style={{ fontFamily: 'var(--font-mono)', marginTop: 8 }}>{f.label}</figcaption>
        </figure>
      ))}
    </div>
  );
}
