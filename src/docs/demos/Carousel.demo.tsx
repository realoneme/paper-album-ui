import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Carousel', group: 'Data display', height: 300 };

const prints = [
  { ph: 'ph-1', caption: 'Otaru, dawn' },
  { ph: 'ph-2', caption: 'Harbour fog' },
  { ph: 'ph-3', caption: 'Pine road' },
];

export default function CarouselDemo() {
  return (
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
        </CarouselControls>
      </Carousel>
    </div>
  );
}
