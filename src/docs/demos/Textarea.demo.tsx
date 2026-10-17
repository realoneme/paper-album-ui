import { useState } from 'react';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Textarea', group: 'Forms', height: 330 };

export default function TextareaDemo() {
  const [message, setMessage] = useState('');
  const [caption, setCaption] = useState('');
  return (
    <div className="pa-panel pa-stack" style={{ maxWidth: 420 }}>
      <Field>
        <FieldLabel>Message</FieldLabel>
        <Textarea rows={3} placeholder="[Tell us about your session]" value={message} onChange={(e) => setMessage(e.target.value)} />
      </Field>
      <Field>
        <FieldLabel>Caption</FieldLabel>
        <Textarea
          autoResize
          minRows={2}
          maxRows={6}
          placeholder="[Write a caption for this spread]"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <FieldDescription>Grows as you type, up to six lines, then scrolls.</FieldDescription>
      </Field>
    </div>
  );
}
