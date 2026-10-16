import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'DataTable', group: 'Data display', height: 420 };

type Status = 'Paid' | 'Pending' | 'Refunded';
interface Order {
  id: string;
  client: string;
  album: string;
  status: Status;
  amount: number;
}

/** Sample data. */
const orders: Order[] = [
  { id: '1044', client: 'Hana Sato', album: 'Winter in Hokkaido', status: 'Paid', amount: 380 },
  { id: '1043', client: 'Diego Ruiz', album: 'Lisbon Mornings', status: 'Pending', amount: 120 },
  { id: '1042', client: 'Amelia Brooks', album: 'Wedding · Oct', status: 'Paid', amount: 1450 },
  { id: '1041', client: 'Noor Haddad', album: 'Forest Notes', status: 'Refunded', amount: 95 },
  { id: '1040', client: 'Mira K.', album: 'Harbour Fog', status: 'Paid', amount: 210 },
  { id: '1039', client: 'Tomás Silva', album: 'Family · Spring', status: 'Pending', amount: 640 },
];

const badge: Record<Status, string> = { Paid: 'pa-badge-success', Pending: 'pa-badge-warning', Refunded: 'pa-badge-destructive' };
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const columns: ColumnDef<Order>[] = [
  { accessorKey: 'id', header: 'Order', enableSorting: false, meta: { label: 'Order', cellClassName: 'mono' } },
  { accessorKey: 'client', header: 'Client', cell: ({ row }) => <b>{row.original.client}</b>, enableHiding: false },
  { accessorKey: 'album', header: 'Album', enableSorting: false, meta: { label: 'Album', cellClassName: 'pa-muted' } },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: { label: 'Status' },
    cell: ({ row }) => <span className={`pa-badge ${badge[row.original.status]}`}>{row.original.status}</span>,
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    meta: { label: 'Amount', numeric: true },
    cell: ({ row }) => money.format(row.original.amount),
  },
  {
    id: 'actions',
    header: () => <span className="pa-sr">Actions</span>,
    enableHiding: false,
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" aria-label={`Actions for order ${row.original.id}`} style={{ width: 36, padding: 0 }}>
        <MoreHorizontal className="pa-i" aria-hidden />
      </Button>
    ),
  },
];

export default function DataTableDemo() {
  return (
    <div className="pa-panel">
      <DataTable
        columns={columns}
        data={orders}
        getRowId={(row) => row.id}
        rowLabel={(row) => `Select order ${row.id}`}
        filterColumn="client"
        filterLabel="Filter orders"
        filterPlaceholder="Filter clients…"
        pageSize={4}
        initialSorting={[{ id: 'client', desc: false }]}
        initialRowSelection={{ '1042': true }}
        caption="Sample data."
      />
    </div>
  );
}
