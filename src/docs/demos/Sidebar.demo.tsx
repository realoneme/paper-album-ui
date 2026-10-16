import { useState, type ComponentType, type SVGProps } from 'react';
import { Archive, CalendarDays, FolderOpen, Image, LayoutGrid, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Sidebar', group: 'Layout & navigation', height: 460 };

type Icon = ComponentType<SVGProps<SVGSVGElement>>;
interface Link { id: string; label: string; icon: Icon; badge?: string; seal?: boolean }

const library: Link[] = [
  { id: 'albums', label: 'Albums', icon: Image, badge: '12' },
  { id: 'photos', label: 'All photos', icon: LayoutGrid },
];
const collections: Link[] = [
  { id: 'favourites', label: 'Favourites', icon: Star },
  { id: 'drafts', label: 'Drafts', icon: FolderOpen },
];
const studio: Link[] = [
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'bookings', label: 'Bookings', icon: CalendarDays, badge: '3', seal: true },
  { id: 'archive', label: 'Archive', icon: Archive },
];
const all = [...library, ...collections, ...studio];

export default function SidebarDemo() {
  const [current, setCurrent] = useState('albums');
  const menu = (links: Link[]) => (
    <SidebarMenu>
      {links.map(({ id, label, icon: Icon, badge, seal }) => (
        <SidebarMenuItem key={id}>
          <SidebarMenuButton asChild isActive={current === id}>
            <a href={`#${id}`} onClick={(e) => { e.preventDefault(); setCurrent(id); }}>
              <Icon className="pa-i" aria-hidden />
              {label}
              {badge ? <SidebarMenuBadge variant={seal ? 'seal' : 'count'}>{badge}</SidebarMenuBadge> : null}
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
  const title = all.find((l) => l.id === current)?.label ?? 'Albums';

  return (
    <SidebarProvider>
      <Sidebar aria-label="Studio">
        <SidebarHeader>
          <span className="mark" aria-hidden="true">S</span>Studio name
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Library</SidebarGroupLabel>
            <SidebarGroupContent>{menu(library)}</SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup collapsible defaultOpen={false}>
            <SidebarGroupLabel>Collections</SidebarGroupLabel>
            <SidebarGroupContent>{menu(collections)}</SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Studio</SidebarGroupLabel>
            <SidebarGroupContent>{menu(studio)}</SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="pa-row">
          <SidebarTrigger />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="#albums">Albums</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem><BreadcrumbPage>{current === 'albums' ? 'Winter in Hokkaido' : title}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="pa-row" style={{ justifyContent: 'space-between', margin: '14px 0 18px' }}>
          <h2 className="pa-h3">{current === 'albums' ? 'Winter in Hokkaido' : title}</h2>
          <span className="pa-row">
            <Button variant="secondary">Preview</Button>
            <Button>Publish</Button>
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }} aria-hidden="true">
          {[1, 2, 3, 4].map((n) => <span key={n} className={`pa-ratio ph-${n}`} style={{ aspectRatio: '4 / 3' }} />)}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
