import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'InputGroup', group: 'Forms', height: 200 };

export default function InputGroupDemo() {
  const [query, setQuery] = useState('');
  const [slug, setSlug] = useState('winter-hokkaido');
  const [price, setPrice] = useState('120.00');
  const [applied, setApplied] = useState('120.00');
  return (
    <div className="pa-panel pa-stack" style={{ maxWidth: 420 }}>
      <InputGroup>
        <Search className="pa-i" aria-hidden />
        <InputGroupInput type="search" aria-label="Search photos" placeholder="Search photos" value={query} onChange={(e) => setQuery(e.target.value)} />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>studio.com/</InputGroupAddon>
        <InputGroupInput aria-label="Album URL" value={slug} onChange={(e) => setSlug(e.target.value)} />
      </InputGroup>
      <InputGroup>
        <InputGroupText>$</InputGroupText>
        <InputGroupInput inputMode="decimal" aria-label="Print price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <Button variant="secondary" size="sm" disabled={price === applied} onClick={() => setApplied(price)}>Apply</Button>
      </InputGroup>
    </div>
  );
}
