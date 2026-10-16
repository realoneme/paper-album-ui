import { PhotoHolder, PhotoPlaceholder } from '@/components/ui/photo-holder';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'PhotoHolder', group: 'Data display', height: 300 };

export default function PhotoHolderDemo() {
  return (
    <div
      className="pa-panel"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 40, padding: '36px 32px 28px', alignItems: 'end' }}
    >
      <PhotoHolder variant="corners" caption="Corners">
        <PhotoPlaceholder tone={1} />
      </PhotoHolder>
      <PhotoHolder variant="slits" caption="Corner slits">
        <PhotoPlaceholder tone={2} />
      </PhotoHolder>
      <PhotoHolder variant="pocket" rotate={-2} caption="Pocket">
        <PhotoPlaceholder tone={3} />
      </PhotoHolder>
      <PhotoHolder variant="tape" rotate={2.5} note="Lisbon, May" caption="Tape">
        <PhotoPlaceholder tone={4} />
      </PhotoHolder>
    </div>
  );
}
