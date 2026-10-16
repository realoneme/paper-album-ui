import * as React from 'react';
import { Slider } from '@/components/ui/slider';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Slider', group: 'Forms', height: 150 };

const price = (v: number) => `$${v}`;

export default function SliderDemo() {
  const [grain, setGrain] = React.useState([35]);
  const [range, setRange] = React.useState([80, 240]);
  return (
    <div className="pa-panel pa-stack" style={{ maxWidth: 420 }}>
      <div>
        <div className="pa-row" style={{ justifyContent: 'space-between' }}>
          <span className="pa-label">Film grain</span>
          <code className="pa-code" aria-hidden>{grain[0]}%</code>
        </div>
        <Slider
          aria-label="Film grain"
          value={grain}
          onValueChange={setGrain}
          formatValueText={(v) => `${v}%`}
        />
      </div>
      <div>
        <div className="pa-row" style={{ justifyContent: 'space-between' }}>
          <span className="pa-label">Price range</span>
          <code className="pa-code" aria-hidden>{price(range[0])} – {price(range[1])}</code>
        </div>
        <Slider
          aria-label="Price"
          value={range}
          onValueChange={setRange}
          min={0}
          max={400}
          step={10}
          minStepsBetweenThumbs={1}
          formatValueText={price}
        />
      </div>
    </div>
  );
}
