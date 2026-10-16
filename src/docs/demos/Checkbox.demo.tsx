import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Checkbox', group: 'Forms', height: 110 };

export default function CheckboxDemo() {
  const [print, setPrint] = useState(true);
  const [wrap, setWrap] = useState(false);
  const all = print && wrap ? true : print || wrap ? 'indeterminate' : false;
  const setAll = (value: boolean) => {
    setPrint(value);
    setWrap(value);
  };
  return (
    <div className="pa-col">
      <Checkbox checked={print} onCheckedChange={(v) => setPrint(v === true)}>Order printed copy</Checkbox>
      <Checkbox checked={wrap} onCheckedChange={(v) => setWrap(v === true)}>Gift wrap</Checkbox>
      <Checkbox checked={all} onCheckedChange={() => setAll(all !== true)}>Select all</Checkbox>
    </div>
  );
}
