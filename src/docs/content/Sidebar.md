# Sidebar

The studio app shell: a sidebar of grouped links with counts and a nested group, beside the content area.

- Consumer provides: brand, groups of links, the current page, a user footer.
- React (`@/components/ui/sidebar`): `SidebarProvider` (optional shell with `defaultOpen`/`open`/`onOpenChange`; `useSidebar()`), `Sidebar` (`aside`, required `aria-label`, `collapsible="offcanvas" | "none"`), `SidebarTrigger`, `SidebarHeader` (brand row; add `<span className="mark">`), `SidebarContent`, `SidebarGroup` (`role="group"`, `collapsible` + `defaultOpen` for a nested group), `SidebarGroupLabel`, `SidebarGroupContent`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton` (`isActive` → `aria-current="page"`, `asChild` for links), `SidebarMenuBadge` (`variant="count" | "seal"`), `SidebarFooter`, `SidebarInset` (`main`). Uses the `sidebar-*` tokens; below 640px the shell stacks.

```tsx
<SidebarProvider>
  <Sidebar aria-label="Studio">
    <SidebarHeader><span className="mark" aria-hidden>S</span>Studio name</SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Library</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive>
                <a href="/albums"><Image className="pa-i" aria-hidden />Albums<SidebarMenuBadge>12</SidebarMenuBadge></a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
  <SidebarInset>…</SidebarInset>
</SidebarProvider>
```
