# Data Table

Table plus tools: filter, column menu, sortable headers, row selection, row actions and pagination.

- Consumer provides: columns, rows, sort state, selection, page.
- React: `DataTable<TData>` (TanStack Table v8) with `columns`, `data`, `getRowId`, `rowLabel` (checkbox names, e.g. "Select order 1044"), `filterColumn` / `filterLabel` / `filterPlaceholder`, `columnMenu`, `pageSize`, `initialSorting`, `initialRowSelection`, `onRowSelectionChange`, `caption`. Sortable headers get a button and `aria-sort`; selected rows get `aria-selected`. Column `meta`: `numeric`, `label` (Columns menu), `cellClassName`. `DataTableCheckbox` is the `pa-check` box on its own.

```tsx
const columns: ColumnDef<Order>[] = [
  { accessorKey: 'client', header: 'Client' },
  { accessorKey: 'amount', header: 'Amount', meta: { numeric: true } },
];

<DataTable columns={columns} data={orders} getRowId={(o) => o.id} filterColumn="client" pageSize={10} />
```
