import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

describe('Textarea', () => {
  it('renders a labelled multi-line groove with merged classes', () => {
    render(
      <Field>
        <FieldLabel>Message</FieldLabel>
        <Textarea rows={3} className="extra" placeholder="[Tell us about your session]" />
      </Field>,
    );
    const ta = screen.getByRole('textbox', { name: 'Message' });
    expect(ta.tagName).toBe('TEXTAREA');
    expect(ta).toHaveClass('pa-textarea', 'extra');
    expect(ta).toHaveAttribute('rows', '3');
  });

  it('accepts multi-line typing', async () => {
    render(<Textarea aria-label="Message" />);
    await userEvent.type(screen.getByRole('textbox'), 'Golden hour{Enter}by the lake');
    expect(screen.getByRole('textbox')).toHaveValue('Golden hour\nby the lake');
  });

  it('picks up the field error and supports disabled', () => {
    render(
      <Field>
        <FieldLabel>Notes</FieldLabel>
        <Textarea disabled />
        <FieldError>Add a few words about the session.</FieldError>
      </Field>,
    );
    const ta = screen.getByRole('textbox', { name: 'Notes' });
    expect(ta).toBeDisabled();
    expect(ta).toHaveAttribute('aria-invalid', 'true');
    expect(ta).toHaveAccessibleDescription('Add a few words about the session.');
  });
});
