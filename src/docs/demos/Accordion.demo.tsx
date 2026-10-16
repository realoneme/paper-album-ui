import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Accordion', group: 'Layout & navigation', height: 300 };

export default function AccordionDemo() {
  return (
    <div className="pa-panel" style={{ maxWidth: 560 }}>
      <Accordion type="single" collapsible defaultValue="delivery">
        <AccordionItem value="delivery">
          <AccordionTrigger>How soon will I see my photos?</AccordionTrigger>
          <AccordionContent>A preview gallery arrives within 3 days; the full edited album within 2 weeks.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="prints">
          <AccordionTrigger>Can I order printed albums?</AccordionTrigger>
          <AccordionContent>Yes. Linen-bound albums come in two sizes, printed on archival paper.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="travel">
          <AccordionTrigger>Do you travel for sessions?</AccordionTrigger>
          <AccordionContent>Anywhere in Japan and Portugal; travel costs are quoted with the booking.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
