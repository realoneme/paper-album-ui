import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Switch', group: 'Forms', height: 90 };

export default function SwitchDemo() {
  const [captions, setCaptions] = useState(true);
  return (
    <div className="pa-row" style={{ gap: 24 }}>
      <span className="pa-row">
        <Switch id="switch-demo-captions" checked={captions} onCheckedChange={setCaptions} />
        <Label htmlFor="switch-demo-captions">Show captions</Label>
      </span>
      <span className="pa-row">
        <Switch id="switch-demo-downloads" />
        <Label htmlFor="switch-demo-downloads">Allow downloads</Label>
      </span>
    </div>
  );
}
