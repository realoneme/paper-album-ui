import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

function Demo({ type = 'single' }: { type?: 'single' | 'multiple' }) {
  const items = (
    <>
      <AccordionItem value="a" className="extra">
        <AccordionTrigger>How soon?</AccordionTrigger>
        <AccordionContent>Within 3 days.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Printed albums?</AccordionTrigger>
        <AccordionContent>Yes.</AccordionContent>
      </AccordionItem>
    </>
  );
  return type === 'single' ? (
    <Accordion type="single" collapsible defaultValue="a">{items}</Accordion>
  ) : (
    <Accordion type="multiple">{items}</Accordion>
  );
}

describe('Accordion', () => {
  it('renders triggers as buttons inside h3 headings with aria-expanded', () => {
    const { container } = render(<Demo />);
    const first = screen.getByRole('button', { name: 'How soon?' });
    expect(first).toHaveClass('pa-acc-trigger');
    expect(first).toHaveAttribute('aria-expanded', 'true');
    expect(first.closest('h3')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Printed albums?' })).toHaveAttribute('aria-expanded', 'false');
    expect(container.querySelector('.pa-acc-item.extra')).not.toBeNull();
  });

  it('shows the open panel as a labelled region in the sunken well', () => {
    render(<Demo />);
    const region = screen.getByRole('region', { name: 'How soon?' });
    expect(region.querySelector('.pa-acc-panel')).toHaveTextContent('Within 3 days.');
    expect(screen.queryByText('Yes.')).not.toBeInTheDocument();
  });

  it('opens one at a time in single mode and can close', async () => {
    render(<Demo />);
    const first = screen.getByRole('button', { name: 'How soon?' });
    const second = screen.getByRole('button', { name: 'Printed albums?' });
    await userEvent.click(second);
    expect(second).toHaveAttribute('aria-expanded', 'true');
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Yes.')).toBeInTheDocument();
    await userEvent.click(second);
    expect(second).toHaveAttribute('aria-expanded', 'false');
  });

  it('allows several open in multiple mode', async () => {
    render(<Demo type="multiple" />);
    await userEvent.click(screen.getByRole('button', { name: 'How soon?' }));
    await userEvent.click(screen.getByRole('button', { name: 'Printed albums?' }));
    expect(screen.getAllByRole('region')).toHaveLength(2);
  });

  it('toggles with the keyboard', async () => {
    render(<Demo type="multiple" />);
    screen.getByRole('button', { name: 'How soon?' }).focus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'How soon?' })).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: 'Printed albums?' })).toHaveFocus();
  });
});
