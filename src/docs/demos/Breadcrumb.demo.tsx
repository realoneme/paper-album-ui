import { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Breadcrumb', group: 'Layout & navigation', height: 120 };

export default function BreadcrumbDemo() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="pa-stack">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="#b">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="#b">Albums</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Lisbon mornings</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Breadcrumb aria-label="Breadcrumb, collapsed">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="#b">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          {expanded ? (
            <>
              <BreadcrumbItem><BreadcrumbLink href="#b">Albums</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem><BreadcrumbLink href="#b">Lisbon mornings</BreadcrumbLink></BreadcrumbItem>
            </>
          ) : (
            <BreadcrumbItem><BreadcrumbEllipsis onClick={() => setExpanded(true)} /></BreadcrumbItem>
          )}
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem><BreadcrumbLink href="#b">Spread 2</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem><BreadcrumbPage>IMG_2034</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
