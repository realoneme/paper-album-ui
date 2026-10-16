import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

describe('Table', () => {
  it('renders table semantics with caption, column headers and numeric cells', () => {
    render(
      <Table className="mine">
        <TableCaption>All prints are signed.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Size</TableHead>
            <TableHead numeric>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow aria-selected="true">
            <TableCell>A4</TableCell>
            <TableCell numeric>$60</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const table = screen.getByRole('table', { name: 'All prints are signed.' });
    expect(table).toHaveClass('pa-table', 'mine');
    expect(table.parentElement).toHaveClass('pa-table-wrap');
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveAttribute('scope', 'col');
    expect(headers[1]).toHaveClass('num');
    const row = screen.getAllByRole('row')[1]!;
    expect(row).toHaveAttribute('aria-selected', 'true');
    expect(within(row).getByRole('cell', { name: '$60' })).toHaveClass('num');
  });
});
