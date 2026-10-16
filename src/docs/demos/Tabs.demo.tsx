import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Tabs', group: 'Layout & navigation', height: 180 };

export default function TabsDemo() {
  return (
    <div className="pa-panel" style={{ maxWidth: 560 }}>
      <Tabs defaultValue="photos">
        <TabsList aria-label="Album sections">
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="story">Story</TabsTrigger>
          <TabsTrigger value="prints">Prints</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
        </TabsList>
        <TabsContent value="photos" className="pa-muted">24 photos from Winter in Hokkaido.</TabsContent>
        <TabsContent value="story" className="pa-muted">Five days of snow, ferries and late-night ramen.</TabsContent>
        <TabsContent value="prints" className="pa-muted">Order archival prints in three sizes.</TabsContent>
        <TabsContent value="map" className="pa-muted">Sapporo, Otaru and Hakodate.</TabsContent>
      </Tabs>
    </div>
  );
}
