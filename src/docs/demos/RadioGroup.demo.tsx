import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'RadioGroup', group: 'Forms', height: 230 };

const SIZES = [
  { value: 'a4', title: 'A4', meta: '21 × 29.7 cm · from $60' },
  { value: 'a3', title: 'A3', meta: '29.7 × 42 cm · from $95' },
  { value: 'square', title: 'Square', meta: '30 × 30 cm · from $80' },
];

export default function RadioGroupDemo() {
  const [size, setSize] = useState('a3');
  return (
    <div className="pa-panel" style={{ maxWidth: 380 }}>
      <RadioGroup aria-label="Print size" value={size} onValueChange={setSize}>
        {SIZES.map((s) => (
          <RadioGroupItem key={s.value} value={s.value}>
            <span><b>{s.title}</b><br /><span className="pa-caption">{s.meta}</span></span>
          </RadioGroupItem>
        ))}
      </RadioGroup>
    </div>
  );
}
