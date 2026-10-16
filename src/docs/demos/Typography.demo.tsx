import {
  TypographyBlockquote,
  TypographyH1,
  TypographyH4,
  TypographyInlineCode,
  TypographyLead,
  TypographyNote,
  TypographyP,
} from '@/components/ui/typography';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Typography', group: 'Data display', height: 420 };

export default function TypographyDemo() {
  return (
    <div className="pa-stack" style={{ maxWidth: 640 }}>
      <span className="pa-label-caps pa-ground-muted">From the journal</span>
      <TypographyH1>
        The year we followed <em style={{ fontWeight: 300 }}>the snow</em>
      </TypographyH1>
      <TypographyLead>Two weeks in Hokkaido, four rolls a day.</TypographyLead>
      <TypographyH4>Chapter one: Otaru</TypographyH4>
      <TypographyP>
        We arrived before sunrise, when the canal still held the night’s blue. Prints are on{' '}
        <TypographyInlineCode>cotton rag 310gsm</TypographyInlineCode>.
      </TypographyP>
      <TypographyBlockquote>“Photograph the cold the way it feels, not the way it looks.”</TypographyBlockquote>
      <TypographyNote className="pa-ground-muted">Lisbon, early light</TypographyNote>
    </div>
  );
}
