import { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'ButtonGroup', group: 'Actions', height: 90 };

const TOTAL = 24;

export default function ButtonGroupDemo() {
  const [photo, setPhoto] = useState(3);
  return (
    <div className="pa-row">
      <ButtonGroup aria-label="Photo pager">
        <Button aria-label="Previous photo" disabled={photo <= 1} onClick={() => setPhoto((p) => Math.max(1, p - 1))}>
          <ChevronLeft className="pa-i" aria-hidden />
        </Button>
        <ButtonGroupText aria-live="polite">{photo} / {TOTAL}</ButtonGroupText>
        <Button aria-label="Next photo" disabled={photo >= TOTAL} onClick={() => setPhoto((p) => Math.min(TOTAL, p + 1))}>
          <ChevronRight className="pa-i" aria-hidden />
        </Button>
      </ButtonGroup>
      <ButtonGroup variant="primary" aria-label="Download">
        <Button>Download originals</Button>
        <Button size="icon" aria-label="More download options">
          <ChevronDown className="pa-i" aria-hidden />
        </Button>
      </ButtonGroup>
    </div>
  );
}
