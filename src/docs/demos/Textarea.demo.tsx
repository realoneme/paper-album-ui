import { useState } from 'react';
import { Field, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Textarea', group: 'Forms', height: 160 };

export default function TextareaDemo() {
  const [message, setMessage] = useState('');
  return (
    <div className="pa-panel" style={{ maxWidth: 420 }}>
      <Field>
        <FieldLabel>Message</FieldLabel>
        <Textarea rows={3} placeholder="[Tell us about your session]" value={message} onChange={(e) => setMessage(e.target.value)} />
      </Field>
    </div>
  );
}
