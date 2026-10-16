import * as React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import type { DemoMeta } from '../types';
import { stayOpen, useStage } from './support/overlay-stage';

export const meta: DemoMeta = { name: 'NavigationMenu', group: 'Menus', height: 330 };

const COVERS = [
  { title: 'Winter in Hokkaido', count: 24, tone: 'ph-1' },
  { title: 'Lisbon Mornings', count: 18, tone: 'ph-2' },
  { title: 'Forest Notes', count: 32, tone: 'ph-3' },
];

const panel: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 18 };
const column: React.CSSProperties = { gap: 8, paddingLeft: 18, borderLeft: '1px solid var(--border)', fontSize: 14 };

/** The Albums panel starts open; hover, click or press Enter on a top-level item to switch. */
export default function NavigationMenuDemo() {
  const [stage, setStage] = useStage();
  const keep = stayOpen(stage);
  const contentProps = { onPointerDownOutside: keep.onInteractOutside, onFocusOutside: keep.onInteractOutside };
  return (
    <div ref={setStage} style={{ minHeight: 310 }}>
      <NavigationMenu aria-label="Site" defaultValue="albums">
        <NavigationMenuList>
          <NavigationMenuItem value="albums">
            <NavigationMenuTrigger>Albums</NavigationMenuTrigger>
            <NavigationMenuContent {...contentProps}>
              <div style={panel}>
                {COVERS.map((c) => (
                  <NavigationMenuLink key={c.title} href="#albums" className="pa-col" style={{ gap: 6, textDecoration: 'none', color: 'inherit' }}>
                    <span className={`pa-photo ${c.tone} pa-ratio`} style={{ aspectRatio: '16 / 10' }} aria-hidden="true" />
                    <b style={{ fontSize: 14 }}>{c.title}</b>
                    <span className="pa-caption">{c.count} photos</span>
                  </NavigationMenuLink>
                ))}
                <div className="pa-col" style={column}>
                  <span className="pa-grp" style={{ padding: 0 }}>Browse</span>
                  <NavigationMenuLink href="#albums" style={{ color: 'inherit' }}>All albums</NavigationMenuLink>
                  <NavigationMenuLink href="#albums" style={{ color: 'inherit' }}>By location</NavigationMenuLink>
                  <NavigationMenuLink href="#albums" style={{ color: 'inherit' }}>By year</NavigationMenuLink>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value="prints">
            <NavigationMenuTrigger>Prints</NavigationMenuTrigger>
            <NavigationMenuContent {...contentProps} style={{ width: 'min(320px, 100%)' }}>
              <div className="pa-col" style={{ gap: 8, fontSize: 14 }}>
                <span className="pa-grp" style={{ padding: 0 }}>Shop</span>
                <NavigationMenuLink href="#prints" style={{ color: 'inherit' }}>Archival prints</NavigationMenuLink>
                <NavigationMenuLink href="#prints" style={{ color: 'inherit' }}>Framed editions</NavigationMenuLink>
                <NavigationMenuLink href="#prints" style={{ color: 'inherit' }}>Gift cards</NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink topLevel href="#journal">Journal</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink topLevel href="#about">About</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
