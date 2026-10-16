import { MapPin } from 'lucide-react';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Combobox', group: 'Forms', height: 320 };

const places: ComboboxOption[] = [
  { value: 'kyoto', label: 'Kyoto', description: 'Japan' },
  { value: 'skye', label: 'Isle of Skye', description: 'Scotland' },
  { value: 'lisbon', label: 'Lisbon', description: 'Portugal' },
  { value: 'patagonia', label: 'Patagonia', description: 'Argentina' },
  { value: 'hokkaido', label: 'Hokkaido', description: 'Japan' },
  { value: 'big-sur', label: 'Big Sur', description: 'United States' },
];

export default function ComboboxDemo() {
  return (
    <div style={{ maxWidth: 320 }}>
      <Combobox
        label="Location"
        listLabel="Locations"
        options={places}
        defaultValue="kyoto"
        defaultSearch="Ky"
        defaultOpen
        placeholder="Search places"
        emptyMessage="No place found."
        icon={<MapPin className="pa-i" aria-hidden />}
      />
    </div>
  );
}
