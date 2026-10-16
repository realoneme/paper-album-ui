import '@/styles/extra/table.css';
import * as React from 'react';
import { cn } from '@/lib/cn';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** Class for the scroll wrapper around the table. */
  wrapperClassName?: string;
}

/** A plain reading table: uppercase header, row rules, tabular figures. */
export const Table = React.forwardRef<HTMLTableElement, TableProps>(({ className, wrapperClassName, ...props }, ref) => (
  <div className={cn('pa-table-wrap', wrapperClassName)}>
    <table ref={ref} className={cn('pa-table', className)} {...props} />
  </div>
));
Table.displayName = 'Table';

export type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>;
export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>((props, ref) => <thead ref={ref} {...props} />);
TableHeader.displayName = 'TableHeader';

export type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;
export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>((props, ref) => <tbody ref={ref} {...props} />);
TableBody.displayName = 'TableBody';

export type TableFooterProps = React.HTMLAttributes<HTMLTableSectionElement>;
export const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>((props, ref) => <tfoot ref={ref} {...props} />);
TableFooter.displayName = 'TableFooter';

export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>;
/** Set `aria-selected` to shade a selected row. */
export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>((props, ref) => <tr ref={ref} {...props} />);
TableRow.displayName = 'TableRow';

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Right-align the heading of a numeric column. */
  numeric?: boolean;
}
export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, numeric, scope = 'col', ...props }, ref) => (
    <th ref={ref} scope={scope} className={cn(numeric && 'num', className)} {...props} />
  ),
);
TableHead.displayName = 'TableHead';

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /** Right-aligned, semibold tabular figures. */
  numeric?: boolean;
}
export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(({ className, numeric, ...props }, ref) => (
  <td ref={ref} className={cn(numeric && 'num', className)} {...props} />
));
TableCell.displayName = 'TableCell';

export type TableCaptionProps = React.HTMLAttributes<HTMLTableCaptionElement>;
/** A footnote under the table. */
export const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>((props, ref) => <caption ref={ref} {...props} />);
TableCaption.displayName = 'TableCaption';
