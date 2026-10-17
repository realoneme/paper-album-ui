import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import NavigationMenuDemo from '@/docs/demos/NavigationMenu.demo';

function Example() {
  return (
    <NavigationMenu aria-label="Site" className="custom">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Albums</NavigationMenuTrigger>
          <NavigationMenuContent className="wide">
            <NavigationMenuLink href="#all">All albums</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink topLevel active href="#journal">Journal</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

describe('NavigationMenu', () => {
  it('renders a labelled nav with paper classes', () => {
    render(<Example />);
    expect(screen.getByRole('navigation', { name: 'Site' })).toHaveClass('pa-navmenu-root', 'custom');
    expect(screen.getByRole('list')).toHaveClass('pa-navmenu-list');
    const journal = screen.getByRole('link', { name: 'Journal' });
    expect(journal).toHaveClass('pa-navmenu-link');
    expect(journal).toHaveAttribute('aria-current', 'page');
  });

  it('opens and closes a panel from its trigger', async () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Albums' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const link = screen.getByRole('link', { name: 'All albums' });
    expect(link.closest('.pa-navmenu-content')).toHaveClass('pa-pop', 'wide');
    await userEvent.click(trigger);
    expect(screen.queryByRole('link', { name: 'All albums' })).not.toBeInTheDocument();
  });

  it('opens with Enter, tabs into the panel and closes with Escape', async () => {
    render(<Example />);
    await userEvent.tab();
    const trigger = screen.getByRole('button', { name: 'Albums' });
    expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.tab();
    expect(screen.getByRole('link', { name: 'All albums' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('demo starts with the Albums panel open and survives outside clicks', async () => {
    render(<><button type="button">Elsewhere</button><NavigationMenuDemo /></>);
    expect(screen.getByRole('button', { name: 'Albums' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: /Winter in Hokkaido/ })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Elsewhere' }));
    expect(screen.getByRole('link', { name: /Winter in Hokkaido/ })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Prints' }));
    expect(screen.getByRole('link', { name: 'Framed editions' })).toBeInTheDocument();
  });

  it('opens a panel on hover without a delay by default', async () => {
    render(<Example />);
    await userEvent.hover(screen.getByRole('button', { name: 'Albums' }));
    expect(await screen.findByRole('link', { name: 'All albums' }, { timeout: 50 })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'All albums' }).closest('.pa-navmenu-content')).toHaveAttribute('data-state', 'open');
  });
});
