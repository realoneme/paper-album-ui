import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Card', group: 'Data display', height: 380 };

export default function CardDemo() {
  return (
    <Card variant="stack" asChild style={{ maxWidth: 340 }}>
      <article>
        <div className="pa-photo ph-1 pa-ratio" style={{ aspectRatio: '16 / 10', margin: '16px 16px 0', width: 'auto' }} aria-hidden />
        <CardHeader>
          <span className="pa-label-caps pa-muted">Album · 2026</span>
          <CardTitle>Winter in Hokkaido</CardTitle>
          <CardDescription>Snow light, harbour mornings and a very cold ferry.</CardDescription>
        </CardHeader>
        <CardFooter style={{ paddingTop: 18 }}>
          <Button>Open album</Button>
          <Button variant="secondary">Share</Button>
        </CardFooter>
      </article>
    </Card>
  );
}
