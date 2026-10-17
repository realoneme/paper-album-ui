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
 * vaul always opens its drawer modally (it does not pass `modal` on to Radix Dialog), which locks and hides
 * the rest of the docs page while it is open. So the stage starts with a working in-page copy of the sheet
 * (same classes, same size picker and state), and the trigger opens the real modal drawer inside the stage.
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
  const sizes = (
    <ToggleGroup type="single" aria-label="Size" value={size} onValueChange={(v) => v && setSize(v)} style={{ display: 'flex' }}>
      {SIZES.map((s) => (
        <ToggleGroupItem key={s.value} value={s.value} style={{ flex: 1, justifyContent: 'center' }}>
          {s.label} · ${s.price}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
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
            <section className="pa-pop pa-drawer" aria-label="Order a print, preview" data-testid="drawer-preview">
              <div className="pa-drawer-handle" aria-hidden="true" />
              <div className="pa-drawer-header">
                <h4 className="pa-h4" style={{ margin: 0 }}>Order a print</h4>
                <p className="pa-caption" style={{ margin: 0 }}>Archival cotton paper, signed on the back.</p>
              </div>
              {sizes}
              <div className="pa-drawer-footer">
                <Button variant="secondary" style={{ flex: 1 }} onClick={() => setPreview(false)}>Cancel</Button>
                <Button style={{ flex: 2 }} onClick={() => setPreview(false)}>Add to cart · ${price}</Button>
              </div>
            </section>
          )}
          <DrawerContent container={stage}>
            <DrawerHeader>
              <DrawerTitle>Order a print</DrawerTitle>
              <DrawerDescription>Archival cotton paper, signed on the back.</DrawerDescription>
            </DrawerHeader>
            {sizes}
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
