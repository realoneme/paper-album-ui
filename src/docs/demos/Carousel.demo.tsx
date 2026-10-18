import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselCounter,
  CarouselDots,
  CarouselFlipCard,
  CarouselIndicator,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Carousel', group: 'Data display', height: 620 };

const prints = [
  { ph: 'ph-1', caption: 'Otaru, dawn', details: 'Fujifilm X100V · 23mm · f/8', description: 'The canal before the shops open, with snow still on the warehouse roofs.' },
  { ph: 'ph-2', caption: 'Harbour fog', details: 'Ricoh GR III · 28mm · f/4', description: 'Fog rolled in off the bay at seven; the ferry horn was the only sound.' },
  { ph: 'ph-3', caption: 'Pine road', details: 'Leica Q2 · 28mm · f/5.6', description: 'The coast road north of Yoichi, between two snow showers.' },
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
            {/* Click the centred print to turn it over for its details. */}
            {prints.map((p, i) => (
              <CarouselItem key={p.caption} index={i} aria-label={`${i + 1} of ${prints.length}`}>
                <CarouselFlipCard
                  index={i}
                  label={`${p.caption}: show details`}
                  front={
                    <figure className="pa-print" style={{ margin: 0 }}>
                      <span className={`pa-photo ${p.ph}`} style={{ aspectRatio: '16 / 9' }} />
                      <figcaption className="cap">{p.caption}</figcaption>
                    </figure>
                  }
                  back={
                    <>
                      <p className="pa-flip-title">{p.caption}</p>
                      <p className="pa-flip-meta">{p.details}</p>
                      <p className="pa-flip-text">{p.description}</p>
                    </>
                  }
                />
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
