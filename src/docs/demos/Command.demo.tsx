import { Image, Plus, Upload } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Command', group: 'Menus', height: 340 };

/** The palette inline (it is always "open"); type to filter, arrow keys to move. */
export default function CommandDemo() {
  return (
    <Command label="Command menu">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No albums or actions match.</CommandEmpty>
        <CommandGroup heading="Albums">
          <CommandItem>
            <Image className="pa-i sm" aria-hidden />Winter in Hokkaido<CommandShortcut>24 photos</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Image className="pa-i sm" aria-hidden />Lisbon Mornings<CommandShortcut>18 photos</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem><Plus className="pa-i sm" aria-hidden />New album</CommandItem>
          <CommandItem><Upload className="pa-i sm" aria-hidden />Upload photos</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
