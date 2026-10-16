import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { DemoMeta } from '../types';
import { FakePage, useStage } from './support/overlay-stage';

export const meta: DemoMeta = { name: 'Drawer', group: 'Overlays', height: 500 };

const SIZES = [
  { value: 'a4', label: 'A4', price: 60 },
  { value: 'a3', label: 'A3', price: 95 },
  { value: 'square', label: 'Square', price: 80 },
];

/**
 * vaul always opens its drawer modally (it does not pass `modal` on to Radix Dialog), which would hide
 * the rest of the docs page from assistive tech. So the stage starts with a static picture drawn with the
 * same classes, and the trigger opens the real drawer inside the stage.
 */
export default function DrawerDemo() {
  const [stage, setStage] = useStage();
  const [open, setOpen] = React.useState(false);
  const [preview, setPreview] = React.useState(true);
  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) setPreview(false);
  };
  const [size, setSize] = React.useState('a3');
  const price = SIZES.find((s) => s.value === size)?.price ?? 95;
  return (
    <div className="pa-stack">
      <Drawer open={open} onOpenChange={onOpenChange} container={stage}>
        <div className="pa-row">
          <DrawerTrigger asChild>
            <Button variant="secondary">Order a print</Button>
          </DrawerTrigger>
        </div>
        <div ref={setStage} className="pa-stage">
          <FakePage />
          {(open || preview) && <div className="pa-backdrop" aria-hidden="true" />}
          {preview && (
            <div className="pa-pop pa-drawer" aria-hidden="true" data-testid="drawer-preview">
              <div className="pa-drawer-handle" />
              <h2 className="pa-h4" style={{ margin: 0 }}>Order a print</h2>
              <p className="pa-caption" style={{ margin: '4px 0 16px' }}>Archival cotton paper, signed on the back.</p>
              <div className="pa-tgroup" style={{ display: 'flex' }}>
                {SIZES.map((s) => (
                  <span key={s.value} className="pa-tgroup-item" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 40, borderRadius: 5, fontWeight: 600, fontSize: 14, ...(s.value === 'a3' ? { background: 'var(--card)', boxShadow: '0 2px 0 var(--border)' } : {}) }}>{s.label} · ${s.price}</span>
                ))}
              </div>
              <div className="pa-row" style={{ marginTop: 16 }}>
                <Button variant="secondary" tabIndex={-1} style={{ flex: 1 }} onClick={() => setPreview(false)}>Cancel</Button>
                <Button tabIndex={-1} style={{ flex: 2 }} onClick={() => setPreview(false)}>Add to cart · $95</Button>
              </div>
            </div>
          )}
          <DrawerContent container={stage}>
            <DrawerHeader>
              <DrawerTitle>Order a print</DrawerTitle>
              <DrawerDescription>Archival cotton paper, signed on the back.</DrawerDescription>
            </DrawerHeader>
            <ToggleGroup
              type="single"
              aria-label="Size"
              value={size}
              onValueChange={(v) => v && setSize(v)}
              style={{ display: 'flex' }}
            >
              {SIZES.map((s) => (
                <ToggleGroupItem key={s.value} value={s.value} style={{ flex: 1 }}>
                  {s.label} · ${s.price}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="secondary" style={{ flex: 1 }}>Cancel</Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button style={{ flex: 2 }}>Add to cart · ${price}</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </div>
      </Drawer>
    </div>
  );
}
