import { useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  Table as TableType,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '../buttons';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const DataTable = <TData, TValue,>({
  columns,
  data,
  type,
}: DataTableProps<TData, TValue> & { type: 'messages' | 'tags' | 'pages' | 'nodes' | 'scans' }) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  const ariaLabelMap = {
    messages: 'Messages List',
    tags: 'Tags List',
    pages: 'Pages List',
    nodes: 'Nodes List',
    scans: 'Scans List',
  };

  return (
    <>
      <div>
        <Table role="table" aria-label={ariaLabelMap[type]}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} role="columnheader">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  role="row"
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} role="cell">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow role="row">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                  role="cell"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <PaginationControls table={table} />
        </div>
      )}
    </>
  );
}

export default DataTable;

interface PaginationControlsProps<TData> {
  table: TableType<TData>;
}
const PaginationControls = <TData,>({
  table,
}: PaginationControlsProps<TData>) => (
  <div className="flex items-center space-x-2">
    <Button
      variant="outline"
      className="hidden h-8 w-8 p-0 lg:flex"
      onClick={() => table.setPageIndex(0)}
      disabled={!table.getCanPreviousPage()}
      aria-label="First page"
    >
      <span className="sr-only">Go to first page</span>
      <DoubleArrowLeftIcon className="h-4 w-4" />
    </Button>
    <Button
      variant="outline"
      className="h-8 w-8 p-0"
      onClick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
    >
      <span className="sr-only">Go to previous page</span>
      <ChevronLeftIcon className="h-4 w-4" />
    </Button>
    <Button
      variant="outline"
      className="h-8 w-8 p-0"
      onClick={() => table.nextPage()}
      disabled={!table.getCanNextPage()}
    >
      <span className="sr-only">Go to next page</span>
      <ChevronRightIcon className="h-4 w-4" />
    </Button>
    <Button
      variant="outline"
      className="hidden h-8 w-8 p-0 lg:flex"
      onClick={() => table.setPageIndex(table.getPageCount() - 1)}
      disabled={!table.getCanNextPage()}
    >
      <span className="sr-only">Go to last page</span>
      <DoubleArrowRightIcon className="h-4 w-4" />
    </Button>
  </div>
);
