import { Kbd, KbdGroup } from '@/components/ui/kbd';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Kbd', group: 'Data display', height: 160 };

const row = { justifyContent: 'space-between' } as const;

export default function KbdDemo() {
  return (
    <div className="pa-panel pa-stack" style={{ maxWidth: 360, gap: 12 }}>
      <div className="pa-row" style={row}>
        <span>Search</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </div>
      <div className="pa-row" style={row}>
        <span>Previous / next photo</span>
        <KbdGroup>
          <Kbd aria-label="Left arrow">←</Kbd>
          <Kbd aria-label="Right arrow">→</Kbd>
        </KbdGroup>
      </div>
      <div className="pa-row" style={row}>
        <span>Close viewer</span>
        <Kbd>Esc</Kbd>
      </div>
    </div>
  );
}
