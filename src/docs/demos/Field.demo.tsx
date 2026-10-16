import { useState } from 'react';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Field', group: 'Forms', height: 230 };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function FieldDemo() {
  const [title, setTitle] = useState('Winter in Hokkaido');
  const [email, setEmail] = useState('hello@');
  const emailError = EMAIL.test(email) ? null : 'Enter a complete email address.';
  return (
    <div className="pa-panel pa-stack" style={{ maxWidth: 380 }}>
      <Field>
        <FieldLabel>Album title</FieldLabel>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        <FieldDescription>Shown on the cover pocket.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <FieldError>{emailError}</FieldError>
      </Field>
    </div>
  );
}
