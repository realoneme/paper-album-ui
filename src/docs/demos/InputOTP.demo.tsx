import { useState } from 'react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'InputOTP', group: 'Forms', height: 140 };

export default function InputOTPDemo() {
  const [code, setCode] = useState('482');
  return (
    <div className="pa-panel">
      <span className="pa-label" id="otp-demo-label">Client gallery code</span>
      <div style={{ marginTop: 12 }}>
        <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={code} onChange={setCode} aria-labelledby="otp-demo-label">
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
    </div>
  );
}
