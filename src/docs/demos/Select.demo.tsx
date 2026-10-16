import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Select', group: 'Forms', height: 340 };

/** Rendered closed: an open Radix Select is modal (it locks scroll and outside clicks). */
export default function SelectDemo() {
  const id = React.useId();
  return (
    <div className="pa-field" style={{ maxWidth: 300 }}>
      <label className="pa-label" htmlFor={id}>Genre</label>
      <Select defaultValue="landscape">
        <SelectTrigger id={id}>
          <SelectValue placeholder="Choose a genre" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Outdoor</SelectLabel>
            <SelectItem value="landscape">Landscape</SelectItem>
            <SelectItem value="street">Street</SelectItem>
            <SelectItem value="travel">Travel</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>People</SelectLabel>
            <SelectItem value="portrait">Portrait</SelectItem>
            <SelectItem value="events" disabled>Events · fully booked</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
