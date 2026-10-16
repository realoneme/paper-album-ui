import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Label', group: 'Forms', height: 70 };

export default function LabelDemo() {
  const [title, setTitle] = useState('Winter in Hokkaido');
  return (
    <div className="pa-panel" style={{ maxWidth: 360 }}>
      <div className="pa-field">
        <Label htmlFor="label-demo-title">Album title</Label>
        <Input id="label-demo-title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
    </div>
  );
}
