import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselCounter,
  CarouselDots,
  CarouselIndicator,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Carousel', group: 'Data display', height: 620 };

const prints = [
  { ph: 'ph-1', caption: 'Otaru, dawn' },
  { ph: 'ph-2', caption: 'Harbour fog' },
  { ph: 'ph-3', caption: 'Pine road' },
];

const roll = [
  'Snow gate', 'Tram stop', 'Lantern row', 'Ice harbour', 'Shrine steps', 'Morning market',
  'Ferry deck', 'Birch wood', 'Night ramen', 'Hot spring', 'Station clock', 'Last light',
].map((caption, i) => ({ caption, ph: `ph-${(i % 3) + 1}` }));

export default function CarouselDemo() {
  return (
    <div className="pa-stack">
      <div className="pa-panel">
        <Carousel aria-label="Featured prints">
          <CarouselContent>
            {prints.map((p, i) => (
              <CarouselItem key={p.caption} aria-label={`${i + 1} of ${prints.length}`}>
                <figure className="pa-print" style={{ margin: 0 }}>
                  <span className={`pa-photo ${p.ph}`} style={{ aspectRatio: '16 / 9' }} />
                  <figcaption className="cap">{p.caption}</figcaption>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselControls>
            <CarouselPrevious size="sm" style={{ width: 36, padding: 0 }} />
            <CarouselDots count={prints.length} />
            <CarouselNext size="sm" style={{ width: 36, padding: 0 }} />
            <CarouselCounter count={prints.length} />
          </CarouselControls>
        </Carousel>
      </div>
      <div className="pa-panel">
        <Carousel aria-label="Hokkaido roll">
          <CarouselContent>
            {roll.map((p, i) => (
              <CarouselItem key={p.caption} aria-label={`${i + 1} of ${roll.length}`}>
                <figure className="pa-print" style={{ margin: 0 }}>
                  <span className={`pa-photo ${p.ph}`} style={{ aspectRatio: '16 / 9' }} />
                  <figcaption className="cap">{p.caption}</figcaption>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselControls>
            <CarouselPrevious size="sm" style={{ width: 36, padding: 0 }} />
            {/* 12 pages is too many dots, so `auto` shows the counter. */}
            <CarouselIndicator count={roll.length} />
            <CarouselNext size="sm" style={{ width: 36, padding: 0 }} />
          </CarouselControls>
        </Carousel>
      </div>
    </div>
  );
}
