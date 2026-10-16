import { useState } from 'react';
import { Input } from '@/components/ui/input';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Input', group: 'Forms', height: 120 };

export default function InputDemo() {
  const [name, setName] = useState('');
  return (
    <div className="pa-panel pa-stack" style={{ maxWidth: 380 }}>
      <Input aria-label="Name" placeholder="[Name]" value={name} onChange={(e) => setName(e.target.value)} />
      <Input aria-label="Disabled field" value="Pickup only" disabled readOnly />
    </div>
  );
}
