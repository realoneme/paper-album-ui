import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'NativeSelect', group: 'Forms', height: 130 };

export default function NativeSelectDemo() {
  return (
    <div className="pa-panel" style={{ maxWidth: 360 }}>
      <label className="pa-field">
        <span className="pa-label">Paper stock</span>
        <NativeSelect defaultValue="cotton">
          <NativeSelectOption value="cotton">Cotton rag, matte</NativeSelectOption>
          <NativeSelectOption value="baryta">Baryta, satin</NativeSelectOption>
          <NativeSelectOption value="washi">Washi, textured</NativeSelectOption>
        </NativeSelect>
      </label>
    </div>
  );
}
