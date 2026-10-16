import { ScrollArea } from '@/components/ui/scroll-area';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'ScrollArea', group: 'Layout & navigation', height: 250 };

const tags: [string, number][] = [
  ['Snow', 48], ['Harbour', 31], ['Night', 27], ['Film', 24], ['Portrait', 19], ['Ferry', 14], ['Market', 12], ['Birch', 11],
];

export default function ScrollAreaDemo() {
  return (
    <div className="pa-panel" style={{ maxWidth: 360 }}>
      <ScrollArea label="Photo tags" type="always">
        {tags.map(([tag, count]) => (
          <div
            key={tag}
            className="pa-row"
            style={{ justifyContent: 'space-between', padding: '10px 4px', borderBottom: '1px solid var(--muted)', fontSize: 14 }}
          >
            <span>{tag}</span>
            <span className="pa-muted" style={{ fontVariantNumeric: 'tabular-nums' }}>{count}</span>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
