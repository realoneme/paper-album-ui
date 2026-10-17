import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import type { DemoMeta } from '../types';
import { stayOpen, useStage } from './support/overlay-stage';

export const meta: DemoMeta = { name: 'HoverCard', group: 'Overlays', height: 470 };

/**
 * Shown open; point at the name to bring it back after it closes. The card drops from wherever the
 * pointer enters the link and swings on its thread before settling.
 */
export default function HoverCardDemo() {
  const [stage, setStage] = useStage();
  return (
    <div ref={setStage} style={{ position: 'relative', minHeight: 450, paddingLeft: 96 }}>
      <p style={{ margin: 0 }}>
        Shot with{' '}
        <HoverCard defaultOpen>
          <HoverCardTrigger href="#mira" style={{ fontWeight: 600, color: 'inherit', textUnderlineOffset: 4 }}>
            @mira.k
          </HoverCardTrigger>
          <HoverCardContent container={stage} {...stayOpen(stage)}>
            <span className="pa-photo ph-3 pa-hovercard-photo" aria-hidden="true" />
            <p className="pa-hovercard-name">Mira K.</p>
            <p className="pa-caption pa-hovercard-bio">Second shooter · film and natural light.</p>
            <dl className="pa-hovercard-stats">
              <div><dt>Albums</dt><dd>12</dd></div>
              <div><dt>Photos</dt><dd>1,480</dd></div>
            </dl>
            <a className="pa-hovercard-link" href="#mira">View profile</a>
          </HoverCardContent>
        </HoverCard>{' '}
        in March.
      </p>
    </div>
  );
}
