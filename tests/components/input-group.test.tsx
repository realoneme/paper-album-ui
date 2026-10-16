import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';

describe('InputGroup', () => {
  it('renders the groove with an addon and merges className', () => {
    render(
      <InputGroup className="extra" data-testid="group">
        <InputGroupAddon>studio.com/</InputGroupAddon>
        <InputGroupInput aria-label="Album URL" defaultValue="winter-hokkaido" />
      </InputGroup>,
    );
    expect(screen.getByTestId('group')).toHaveClass('pa-igroup', 'extra');
    expect(screen.getByText('studio.com/')).toHaveClass('addon');
    expect(screen.getByRole('textbox', { name: 'Album URL' })).toHaveValue('winter-hokkaido');
  });

  it('accepts typing and runs the trailing button', async () => {
    const onApply = vi.fn();
    render(
      <InputGroup>
        <InputGroupText>$</InputGroupText>
        <InputGroupInput aria-label="Print price" />
        <Button variant="secondary" size="sm" onClick={onApply}>Apply</Button>
      </InputGroup>,
    );
    await userEvent.type(screen.getByRole('textbox', { name: 'Print price' }), '95.00');
    expect(screen.getByRole('textbox', { name: 'Print price' })).toHaveValue('95.00');
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(onApply).toHaveBeenCalledTimes(1);
  });

  it('supports search type and disabled', () => {
    render(<InputGroup><InputGroupInput type="search" aria-label="Search photos" disabled /></InputGroup>);
    const input = screen.getByRole('searchbox', { name: 'Search photos' });
    expect(input).toBeDisabled();
  });
});
