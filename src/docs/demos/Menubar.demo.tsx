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
import type { DemoMeta } from '../types';
import { stayOpen, useDemoValue, useStage } from './support/overlay-stage';

export const meta: DemoMeta = { name: 'Menubar', group: 'Menus', height: 320 };

const OTHER_MENUS: Record<string, string[]> = {
  edit: ['Undo', 'Redo', 'Select all photos'],
  view: ['Grid', 'Filmstrip', 'Full screen'],
  album: ['Rename album', 'Reorder photos', 'Album settings'],
};

/**
 * The File menu (and its Export submenu) start open; clicks elsewhere on the page leave it open. Hover or the
 * arrow keys move the paper slip between menus.
 */
export default function MenubarDemo() {
  const [stage, setStage] = useStage();
  const { value, onValueChange, onOpenAutoFocus } = useDemoValue('file');
  const contentProps = { container: stage, onOpenAutoFocus, ...stayOpen(stage) };
  return (
    <div ref={setStage} style={{ position: 'relative', minHeight: 300 }}>
      <Menubar aria-label="Editor" value={value} onValueChange={onValueChange}>
        <MenubarMenu value="file">
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent {...contentProps} style={{ width: 250 }}>
            <MenubarItem>New album</MenubarItem>
            <MenubarItem>Import photos…</MenubarItem>
            <MenubarSub defaultOpen>
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
