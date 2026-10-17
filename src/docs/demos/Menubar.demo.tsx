import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { useState } from 'react';
import type { DemoMeta } from '../types';
import { stayOpen, useDemoValue, useStage } from './support/overlay-stage';

export const meta: DemoMeta = { name: 'Menubar', group: 'Menus', height: 320 };

const OTHER_MENUS: Record<string, string[]> = {
  edit: ['Undo', 'Redo', 'Select all photos'],
  view: ['Grid', 'Filmstrip', 'Full screen'],
  album: ['Rename album', 'Reorder photos', 'Album settings'],
};

/** Wide enough to show the Export submenu beside the File menu without covering it. */
const showsSubmenuOnLoad = () => typeof window === 'undefined' || !window.matchMedia || window.matchMedia('(min-width: 640px)').matches;

/**
 * The File menu starts open, and on a wide screen its Export submenu too (only on load: once File closes or
 * another menu opens, reopening File shows just the menu). Clicks elsewhere on the page leave it open. Hover or
 * the arrow keys move the paper slip between menus.
 */
export default function MenubarDemo() {
  const [stage, setStage] = useStage();
  const { value, onValueChange: setValue, onOpenAutoFocus } = useDemoValue('file');
  const [exportOpen, setExportOpen] = useState(showsSubmenuOnLoad);
  const onValueChange = (next: string) => {
    if (next !== 'file') setExportOpen(false);
    setValue(next);
  };
  const contentProps = { container: stage, onOpenAutoFocus, ...stayOpen(stage) };
  return (
    <div ref={setStage} style={{ position: 'relative', minHeight: 300 }}>
      <Menubar aria-label="Editor" value={value} onValueChange={onValueChange}>
        <MenubarMenu value="file">
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent {...contentProps} style={{ width: 250 }}>
            <MenubarItem>New album</MenubarItem>
            <MenubarItem>Import photos…</MenubarItem>
            <MenubarSub open={value === 'file' && exportOpen} onOpenChange={setExportOpen}>
              <MenubarSubTrigger>Export as</MenubarSubTrigger>
              <MenubarSubContent container={stage} style={{ width: 190 }}>
                <MenubarItem>JPEG · web</MenubarItem>
                <MenubarItem>TIFF · print</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem disabled>Publish changes</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        {Object.entries(OTHER_MENUS).map(([key, items]) => (
          <MenubarMenu key={key} value={key}>
            <MenubarTrigger>{key[0].toUpperCase() + key.slice(1)}</MenubarTrigger>
            <MenubarContent {...contentProps}>
              {items.map((item) => <MenubarItem key={item}>{item}</MenubarItem>)}
            </MenubarContent>
          </MenubarMenu>
        ))}
      </Menubar>
    </div>
  );
}
