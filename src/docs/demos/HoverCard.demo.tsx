import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import type { DemoMeta } from '../types';
import { stayOpen, useStage } from './support/overlay-stage';

export const meta: DemoMeta = { name: 'HoverCard', group: 'Overlays', height: 200 };

/** Shown open; hover or focus the name to bring it back after it closes. */
export default function HoverCardDemo() {
  const [stage, setStage] = useStage();
  return (
    <div ref={setStage} style={{ position: 'relative', minHeight: 180 }}>
      <p style={{ margin: 0 }}>
        Shot with{' '}
        <HoverCard defaultOpen openDelay={200} closeDelay={150}>
          <HoverCardTrigger href="#mira" style={{ fontWeight: 600, color: 'inherit', textUnderlineOffset: 4 }}>
            @mira.k
          </HoverCardTrigger>
          <HoverCardContent container={stage} {...stayOpen(stage)}>
            <span className="pa-avatar lg photo" aria-hidden="true" />
            <div>
              <b>Mira K.</b>
              <p className="pa-caption" style={{ margin: '4px 0 8px' }}>Second shooter · film and natural light.</p>
              <span className="pa-caption">Joined March 2024</span>
            </div>
          </HoverCardContent>
        </HoverCard>{' '}
        in March.
      </p>
    </div>
  );
}
