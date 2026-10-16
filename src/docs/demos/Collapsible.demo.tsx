import { Camera } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Collapsible', group: 'Layout & navigation', height: 230 };

const settings = [
  ['Shutter', '1/250 s'],
  ['Aperture', 'f/5.6'],
  ['ISO', '200'],
  ['Focal length', '35 mm'],
] as const;

export default function CollapsibleDemo() {
  return (
    <Collapsible defaultOpen style={{ maxWidth: 480 }}>
      <CollapsibleTrigger icon={<Camera className="pa-i" aria-hidden />}>Camera settings</CollapsibleTrigger>
      <CollapsibleContent>
        {settings.map(([label, value]) => (
          <div className="cell" key={label}>
            <div className="pa-caption">{label}</div>
            <b>{value}</b>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
