import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function Demo() {
  return (
    <Tabs defaultValue="photos">
      <TabsList aria-label="Album sections" className="extra">
        <TabsTrigger value="photos">Photos</TabsTrigger>
        <TabsTrigger value="story">Story</TabsTrigger>
        <TabsTrigger value="map" disabled>Map</TabsTrigger>
      </TabsList>
      <TabsContent value="photos">Photo grid</TabsContent>
      <TabsContent value="story">Story text</TabsContent>
      <TabsContent value="map">Map view</TabsContent>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renders a labelled tablist with pa-tab triggers and aria-selected', () => {
    render(<Demo />);
    const list = screen.getByRole('tablist', { name: 'Album sections' });
    expect(list).toHaveClass('pa-tabs', 'extra');
    const photos = screen.getByRole('tab', { name: 'Photos' });
    expect(photos).toHaveClass('pa-tab');
    expect(photos).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Story' })).toHaveAttribute('aria-selected', 'false');
    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveTextContent('Photo grid');
    expect(panel).toHaveAttribute('aria-labelledby', photos.id);
  });

  it('switches panels on click', async () => {
    render(<Demo />);
    await userEvent.click(screen.getByRole('tab', { name: 'Story' }));
    expect(screen.getByRole('tab', { name: 'Story' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Story text');
  });

  it('moves with the arrow keys, skipping disabled tabs and wrapping', async () => {
    render(<Demo />);
    await userEvent.tab();
    expect(screen.getByRole('tab', { name: 'Photos' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    const story = screen.getByRole('tab', { name: 'Story' });
    expect(story).toHaveFocus();
    expect(story).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Photos' })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(story).toHaveFocus();
  });
});
