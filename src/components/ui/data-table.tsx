import '@/styles/extra/data-table.css';
import * as React from 'react';
import { DropdownMenu } from 'radix-ui';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, Check, ChevronDown, ChevronsUpDown, Minus, Search } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Right-align the header and cells (tabular figures). */
    numeric?: boolean;
    /** Name shown in the Columns menu; defaults to the column id. */
    label?: string;
    /** Extra class for this column's cells. */
    cellClassName?: string;
  }
}

/* ---------- Checkbox (same look as the Checkbox component: pa-check) ---------- */

export interface DataTableCheckboxProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean | 'indeterminate';
  onCheckedChange: (checked: boolean) => void;
}

export const DataTableCheckbox = React.forwardRef<HTMLButtonElement, DataTableCheckboxProps>(
  ({ checked, onCheckedChange, className, onClick, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={checked === 'indeterminate' ? 'mixed' : checked}
      className={cn('pa-check', className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onCheckedChange(checked !== true);
      }}
      {...props}
    >
      <span className="box">
        {checked === 'indeterminate' ? <Minus className="pa-i" aria-hidden /> : <Check className="pa-i" aria-hidden />}
      </span>
    </button>
  ),
);
DataTableCheckbox.displayName = 'DataTableCheckbox';

/* ---------- DataTable ---------- */

export interface DataTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /** Stable row ids (recommended when rows can be selected). */
  getRowId?: (row: TData, index: number) => string;
  /** Adds a checkbox column. Default true. */
  enableRowSelection?: boolean;
  /** Accessible name for a row's checkbox, for example (row) => `Select order ${row.id}`. */
  rowLabel?: (row: TData) => string;
  /** Column id to filter with the search field; omit to hide the field. */
  filterColumn?: string;
  filterPlaceholder?: string;
  /** Accessible name of the search field. Default "Filter rows". */
  filterLabel?: string;
  /** Show the Columns visibility menu. Default true. */
  columnMenu?: boolean;
  /** Rows per page. Default 10. */
  pageSize?: number;
  initialSorting?: SortingState;
  initialRowSelection?: RowSelectionState;
  onRowSelectionChange?: (rows: TData[]) => void;
  caption?: React.ReactNode;
  className?: string;
}

const SELECT_COLUMN_ID = 'select';

function ariaSort(sorted: false | 'asc' | 'desc'): React.AriaAttributes['aria-sort'] {
  if (sorted === 'asc') return 'ascending';
  if (sorted === 'desc') return 'descending';
  return 'none';
}

function DataTableInner<TData, TValue>(
  {
    columns,
    data,
    getRowId,
    enableRowSelection = true,
    rowLabel,
    filterColumn,
    filterPlaceholder = 'Filter…',
    filterLabel = 'Filter rows',
    columnMenu = true,
    pageSize = 10,
    initialSorting = [],
    initialRowSelection = {},
    onRowSelectionChange,
    caption,
    className,
  }: DataTableProps<TData, TValue>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(initialRowSelection);

  const allColumns = React.useMemo<ColumnDef<TData, TValue>[]>(() => {
    if (!enableRowSelection) return columns;
    const select: ColumnDef<TData, TValue> = {
      id: SELECT_COLUMN_ID,
      enableSorting: false,
      enableHiding: false,
      meta: { cellClassName: 'pa-dt-check' },
      header: ({ table }) => (
        <DataTableCheckbox
          aria-label="Select all"
          checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? 'indeterminate' : false}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(value)}
        />
      ),
      cell: ({ row }) => (
        <DataTableCheckbox
          aria-label={rowLabel ? rowLabel(row.original) : `Select row ${row.index + 1}`}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={(value) => row.toggleSelected(value)}
        />
      ),
    };
    return [select, ...columns];
  }, [columns, enableRowSelection, rowLabel]);

  const table = useReactTable<TData>({
    data,
    columns: allColumns,
    getRowId,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    enableRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize } },
  });

  const onSelectionRef = React.useRef(onRowSelectionChange);
  onSelectionRef.current = onRowSelectionChange;
  const firstRun = React.useRef(true);
  React.useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    onSelectionRef.current?.(table.getSelectedRowModel().rows.map((row) => row.original));
  }, [rowSelection, table]);

  const filter = filterColumn ? table.getColumn(filterColumn) : undefined;
  const hideable = table.getAllLeafColumns().filter((column) => column.getCanHide());
  const visibleCount = table.getVisibleLeafColumns().length;
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalCount = table.getFilteredRowModel().rows.length;
  const rows = table.getRowModel().rows;

  return (
    <div ref={ref} className={cn('pa-data-table', className)}>
      {filter || columnMenu ? (
        <div className="pa-dt-toolbar">
          {filter ? (
            <div className="pa-igroup">
              <Search className="pa-i sm" aria-hidden />
              <input
                type="search"
                aria-label={filterLabel}
                placeholder={filterPlaceholder}
                value={typeof filter.getFilterValue() === 'string' ? (filter.getFilterValue() as string) : ''}
                onChange={(event) => {
                  filter.setFilterValue(event.target.value);
                  table.setPageIndex(0);
                }}
              />
            </div>
          ) : (
            <span />
          )}
          {columnMenu && hideable.length > 0 ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button variant="secondary" size="sm">
                  Columns
                  <ChevronDown className="pa-i sm" aria-hidden />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content align="end" sideOffset={6} className="pa-pop pa-menu">
                  {hideable.map((column) => (
                    <DropdownMenu.CheckboxItem
                      key={column.id}
                      className="pa-mi"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(value)}
                      onSelect={(event) => event.preventDefault()}
                    >
                      <span className="pa-dt-indicator">
                        <DropdownMenu.ItemIndicator>
                          <Check className="pa-i sm" aria-hidden />
                        </DropdownMenu.ItemIndicator>
                      </span>
                      {column.columnDef.meta?.label ?? column.id}
                    </DropdownMenu.CheckboxItem>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ) : null}
        </div>
      ) : null}

      <Table>
        {caption ? <TableCaption>{caption}</TableCaption> : null}
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => {
                const meta = header.column.columnDef.meta;
                const canSort = header.column.getCanSort();
                const sorted = header.column.getIsSorted();
                const content = header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext());
                const SortIcon = sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ChevronsUpDown;
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    numeric={meta?.numeric}
                    className={meta?.cellClassName}
                    aria-sort={canSort ? ariaSort(sorted) : undefined}
                  >
                    {canSort && !header.isPlaceholder ? (
                      <button type="button" className="pa-table-sort" onClick={header.column.getToggleSortingHandler()}>
                        {content}
                        <SortIcon className="pa-i sm" aria-hidden />
                      </button>
                    ) : (
                      content
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((row) => (
              <TableRow key={row.id} aria-selected={enableRowSelection ? row.getIsSelected() : undefined}>
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta;
                  return (
                    <TableCell key={cell.id} numeric={meta?.numeric} className={meta?.cellClassName}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={visibleCount} className="pa-dt-empty">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="pa-dt-footer">
        <span className="pa-muted" aria-live="polite">
          {enableRowSelection ? `${selectedCount} of ${totalCount} selected` : `${totalCount} rows`}
        </span>
        <span className="pa-dt-pager">
          {table.getPageCount() > 1 ? (
            <span className="pa-muted">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
          ) : null}
          <Button variant="secondary" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="secondary" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </span>
      </div>
    </div>
  );
}

const DataTableWithRef = React.forwardRef(DataTableInner);
DataTableWithRef.displayName = 'DataTable';

/** Table plus tools: filter, column menu, sortable headers, row selection and pagination (TanStack Table v8). */
export const DataTable = DataTableWithRef as <TData, TValue = unknown>(
  props: DataTableProps<TData, TValue> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;
