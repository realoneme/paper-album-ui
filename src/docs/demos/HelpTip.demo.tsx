import { HelpTip } from '@/components/ui/help-tip';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { DemoMeta } from '../types';
import { useStage } from './support/overlay-stage';

export const meta: DemoMeta = { name: 'HelpTip', group: 'Overlays', height: 230 };

/** "About watermarks" starts open; hover, tap or Enter opens the others. */
export default function HelpTipDemo() {
  const [stage, setStage] = useStage();
  return (
    <div ref={setStage} className="pa-panel pa-stack" style={{ position: 'relative', maxWidth: 420, gap: 18 }}>
      <span className="pa-row" style={{ gap: 6 }}>
        <Switch id="helptip-demo-watermark" defaultChecked />
        <Label htmlFor="helptip-demo-watermark">Show watermark</Label>
        <HelpTip label="About watermarks" defaultOpen container={stage}>
          <p>Your studio name is printed faintly in the corner of web-size images. Downloads of originals stay clean.</p>
        </HelpTip>
      </span>
      <span className="pa-row" style={{ gap: 6, marginTop: 96 }}>
        <Switch id="helptip-demo-exif" />
        <Label htmlFor="helptip-demo-exif">Share camera settings</Label>
        <HelpTip label="About camera settings" side="top" container={stage}>
          <p>Shutter, aperture and ISO appear under each photo. Location is never shared.</p>
          <p><a href="#help">Learn more</a></p>
        </HelpTip>
      </span>
    </div>
  );
}
