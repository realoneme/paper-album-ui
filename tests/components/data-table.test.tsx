import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';

interface Order {
  id: string;
  client: string;
  amount: number;
}

const data: Order[] = [
  { id: '1', client: 'Hana Sato', amount: 380 },
  { id: '2', client: 'Diego Ruiz', amount: 120 },
  { id: '3', client: 'Amelia Brooks', amount: 1450 },
];

const columns: ColumnDef<Order>[] = [
  { accessorKey: 'client', header: 'Client' },
  { accessorKey: 'amount', header: 'Amount', meta: { numeric: true, label: 'Amount' } },
];

function clients() {
  const rows = screen.getAllByRole('row').slice(1);
  return rows.map((row) => within(row).getAllByRole('cell')[1]!.textContent);
}

function setup(props: Partial<React.ComponentProps<typeof DataTable<Order>>> = {}) {
  return render(
    <DataTable
      columns={columns}
      data={data}
      getRowId={(r) => r.id}
      rowLabel={(r) => `Select ${r.client}`}
      filterColumn="client"
      filterLabel="Filter clients"
      {...props}
    />,
  );
}

describe('DataTable', () => {
  it('renders a table with sortable headers marked by aria-sort', () => {
    setup();
    expect(screen.getByRole('table')).toHaveClass('pa-table');
    const client = screen.getByRole('columnheader', { name: /Client/ });
    expect(client).toHaveAttribute('aria-sort', 'none');
    expect(screen.getByRole('columnheader', { name: /Amount/ })).toHaveClass('num');
    expect(clients()).toEqual(['Hana Sato', 'Diego Ruiz', 'Amelia Brooks']);
  });

  it('sorts ascending then descending when the header is clicked', async () => {
    setup();
    const user = userEvent.setup();
    const button = within(screen.getByRole('columnheader', { name: /Client/ })).getByRole('button');
    await user.click(button);
    expect(screen.getByRole('columnheader', { name: /Client/ })).toHaveAttribute('aria-sort', 'ascending');
    expect(clients()).toEqual(['Amelia Brooks', 'Diego Ruiz', 'Hana Sato']);
    await user.click(button);
    expect(screen.getByRole('columnheader', { name: /Client/ })).toHaveAttribute('aria-sort', 'descending');
    expect(clients()).toEqual(['Hana Sato', 'Diego Ruiz', 'Amelia Brooks']);
  });

  it('selects rows and reports the selection', async () => {
    const onRowSelectionChange = vi.fn();
    setup({ onRowSelectionChange });
    const user = userEvent.setup();
    const box = screen.getByRole('checkbox', { name: 'Select Diego Ruiz' });
    expect(box).toHaveAttribute('aria-checked', 'false');
    expect(box).toHaveClass('pa-check');
    await user.click(box);
    expect(box).toHaveAttribute('aria-checked', 'true');
    expect(box.closest('tr')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('checkbox', { name: 'Select all' })).toHaveAttribute('aria-checked', 'mixed');
    expect(screen.getByText('1 of 3 selected')).toBeInTheDocument();
    expect(onRowSelectionChange).toHaveBeenLastCalledWith([data[1]]);

    await user.click(screen.getByRole('checkbox', { name: 'Select all' }));
    expect(screen.getByText('3 of 3 selected')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Select all' })).toHaveAttribute('aria-checked', 'true');
  });

  it('filters rows by the chosen column', async () => {
    setup();
    await userEvent.type(screen.getByRole('searchbox', { name: 'Filter clients' }), 'die');
    expect(clients()).toEqual(['Diego Ruiz']);
    await userEvent.clear(screen.getByRole('searchbox', { name: 'Filter clients' }));
    await userEvent.type(screen.getByRole('searchbox', { name: 'Filter clients' }), 'zzz');
    expect(screen.getByText('No results.')).toBeInTheDocument();
  });

  it('paginates with Previous and Next', async () => {
    setup({ pageSize: 2 });
    const user = userEvent.setup();
    const prev = screen.getByRole('button', { name: 'Previous' });
    const next = screen.getByRole('button', { name: 'Next' });
    expect(prev).toBeDisabled();
    expect(clients()).toHaveLength(2);
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    await user.click(next);
    expect(clients()).toEqual(['Amelia Brooks']);
    expect(next).toBeDisabled();
    expect(prev).toBeEnabled();
  });
});
