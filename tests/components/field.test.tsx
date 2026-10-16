import { describe, expect, it } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

describe('Field', () => {
  it('ties label and description to the control', () => {
    render(
      <Field className="extra">
        <FieldLabel>Album title</FieldLabel>
        <Input defaultValue="Winter in Hokkaido" />
        <FieldDescription>Shown on the cover pocket.</FieldDescription>
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Album title' });
    expect(input).toHaveAccessibleDescription('Shown on the cover pocket.');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input.closest('.pa-field')).toHaveClass('extra');
    expect(screen.getByText('Shown on the cover pocket.')).toHaveClass('pa-desc');
  });

  it('marks the control invalid while an error is shown', async () => {
    function EmailField() {
      const [value, setValue] = useState('hello@');
      const error = value.includes('.') ? null : 'Enter a complete email address.';
      return (
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input type="email" value={value} onChange={(e) => setValue(e.target.value)} />
          <FieldError>{error}</FieldError>
        </Field>
      );
    }
    render(<EmailField />);
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Enter a complete email address.');
    expect(screen.getByText('Enter a complete email address.')).toHaveClass('pa-error-text');
    await userEvent.type(input, 'studio.com');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByText('Enter a complete email address.')).not.toBeInTheDocument();
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('respects an explicit invalid prop, controlId and extra describedby', () => {
    render(
      <Field invalid controlId="custom">
        <FieldLabel>Name</FieldLabel>
        <Input aria-describedby="hint" />
        <span id="hint">Your full name.</span>
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toHaveAttribute('id', 'custom');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Your full name.');
  });
});
