import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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

function Demo() {
  return (
    <SidebarProvider className="extra-shell">
      <Sidebar aria-label="Studio" className="extra">
        <SidebarHeader><span className="mark" aria-hidden="true">S</span>Studio name</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Library</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive>
                    <a href="#albums">Albums<SidebarMenuBadge>12</SidebarMenuBadge></a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>All photos</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup collapsible defaultOpen={false}>
            <SidebarGroupLabel>Collections</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>Favourites<SidebarMenuBadge variant="seal">3</SidebarMenuBadge></SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>Signed in</SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
        Content
      </SidebarInset>
    </SidebarProvider>
  );
}

describe('Sidebar', () => {
  it('renders a labelled complementary landmark beside the main inset', () => {
    const { container } = render(<Demo />);
    expect(container.firstElementChild).toHaveClass('pa-shell', 'extra-shell');
    const aside = screen.getByRole('complementary', { name: 'Studio' });
    expect(aside).toHaveClass('pa-sidebar', 'extra');
    expect(within(aside).getByText('Studio name')).toHaveClass('brand');
    expect(screen.getByRole('main')).toHaveClass('pa-sidebar-inset');
    expect(within(aside).getByText('Signed in')).toHaveClass('pa-sidebar-footer');
  });

  it('marks only the active item with aria-current="page"', () => {
    render(<Demo />);
    const albums = screen.getByRole('link', { name: /Albums/ });
    expect(albums).toHaveAttribute('aria-current', 'page');
    expect(albums).toHaveClass('pa-sidebar-btn');
    const photos = screen.getByRole('button', { name: 'All photos' });
    expect(photos).not.toHaveAttribute('aria-current');
    expect(photos).toHaveAttribute('type', 'button');
    expect(within(albums).getByText('12')).toHaveClass('pa-sidebar-badge');
  });

  it('names groups by their label', () => {
    render(<Demo />);
    const lib = screen.getByRole('group', { name: 'Library' });
    expect(within(lib).getAllByRole('listitem')).toHaveLength(2);
  });

  it('opens and closes a collapsible group', async () => {
    render(<Demo />);
    const toggle = screen.getByRole('button', { name: 'Collections' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('button', { name: /Favourites/ })).not.toBeInTheDocument();
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const fav = screen.getByRole('button', { name: /Favourites/ });
    expect(within(fav).getByText('3')).toHaveClass('pa-badge', 'pa-badge-seal');
    expect(screen.getByRole('group', { name: 'Collections' })).toContainElement(fav);
  });

  it('collapses the sidebar with the trigger', async () => {
    const { container } = render(<Demo />);
    const trigger = screen.getByRole('button', { name: 'Toggle sidebar' });
    const aside = screen.getByRole('complementary', { name: 'Studio' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', aside.id);
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(container.firstElementChild).toHaveAttribute('data-state', 'collapsed');
    expect(aside).toHaveAttribute('data-state', 'collapsed');
  });

  it('works without a provider', () => {
    render(
      <Sidebar aria-label="Studio">
        <SidebarMenu><SidebarMenuItem><SidebarMenuButton isActive>Albums</SidebarMenuButton></SidebarMenuItem></SidebarMenu>
      </Sidebar>,
    );
    expect(screen.getByRole('button', { name: 'Albums' })).toHaveAttribute('aria-current', 'page');
  });
});
