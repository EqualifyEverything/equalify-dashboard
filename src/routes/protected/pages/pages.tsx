import React, { HTMLProps, useState } from 'react';
import { UTCDate } from '@date-fns/utc';
import {
  CheckCircledIcon,
  DownloadIcon,
  FileTextIcon,
  ReloadIcon,
} from '@radix-ui/react-icons';
import * as Tooltip from '@radix-ui/react-tooltip';
import { keepPreviousData, QueryClient, useQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
//import DataTable from '~/components/tables/data-table';

import {
  format,
  formatISO,
  formatRelative,
  parse,
  parseISO,
  toDate,
} from 'date-fns';
import { ActionFunctionArgs, Link } from 'react-router-dom';

import { toast } from '~/components/alerts';
import { SEO } from '~/components/layout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/tables/table';
import { pagesQuery } from '~/queries';
//import { LoadingPages } from './loading';
import { getPages, getScan, IPage, IPageScan, IUrl, sendUrlsToScan } from '~/services';

export const pagesLoader = (queryClient: QueryClient) => async () => {
  const initialPages = await queryClient.ensureQueryData(
    pagesQuery({ limit: 10, offset: 0 }),
  );
  return { initialPages };
};

const Pages = () => {
  //const rerender = React.useReducer(() => ({}), {})[1]
  const [rowSelection, setRowSelection] = useState({});

  const sendSelectedPagesToScan = async () => {
    const urlsToSend = table.getSelectedRowModel().flatRows.map((row) => {
      return { url: row.original.url, urlId: row.original.id };
    });

    try {
      const out = {"urls":urlsToSend};
      const response = await sendUrlsToScan(out);

      if (response.status === 'success') {
        toast.success({
          title: 'Success',
          description: 'Pages sent to scan!',
        });
      } else {
        toast.error({
          title: 'Error',
          description: 'There was a problem sending to scan.',
        });
        console.log(urlsToSend);
        console.log(response);
        throw new Response('There was a problem sending to scan', {
          status: 500,
        });

      }
    } catch (error) {
      toast.error({
        title: 'Error',
        description: 'There was a problem sending to scan.',
      });
      console.log(urlsToSend);
      throw error;
    }
    table.resetRowSelection();
    dataQuery.refetch();
  };

  // Define the columns
  const columns = React.useMemo<ColumnDef<IPage>[]>(
    () => 
    [
      {
        accessorKey: 'select',
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        ),
      },
      {
        accessorKey: 'url',
        header: 'URL',
        cell: ({ row }) => (
          <a
            className="text-blue-500 hover:opacity-50"
            target="_blank"
            href={row.original.url}
          >
            {row.original.url}
          </a>
        ),
      },
      {
        accessorKey: 'property',
        header: 'Property',
        cell: ({ row }) => (
          <span>
            <Link to={`/properties/` + row.original.property?.id + `/edit`}>
              {' '}
              {row.original.property?.name}
            </Link>
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <div>
            {row.original?.scans.length > 0 ? (
              row.original.scans[getIndexOfNewestScan(row.original.scans)].processing ? (
                <ReloadIcon aria-label="Processing" className="animate-spin" />
              ) : (
                <div className="inline-flex items-center">
                  <Tooltip.Provider>
                    <Tooltip.Root>
                      <Tooltip.Trigger>
                        <CheckCircledIcon aria-label="Complete" />
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          className="TooltipContent"
                          sideOffset={5}
                        >
                          <div className="text-center text-sm">
                            Last scanned <br />
                            {new Date(
                              row.original.scans[getIndexOfNewestScan(row.original.scans)].updated_at,
                            ).toLocaleString()}
                          </div>
                          <Tooltip.Arrow className="TooltipArrow" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </div>
              )
            ) : (
              <></>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'report',
        header: 'Results JSON',
        cell: ({ row }) =>
          
          row.original?.scans.length > 0 ? (
            row.original.scans[getIndexOfNewestScan(row.original.scans)].processing ? (
              <span className="select-none text-[#666]">Not ready</span>
            ) : (
              <button
                className="inline-flex items-center text-blue-500 hover:opacity-50"
                onClick={async () => {
                  const element = document.getElementById('downloadReportLink');
                  if (element) {
                    const response = await getScan(row.original.scans[getIndexOfNewestScan(row.original.scans)].id);
                    element.setAttribute(
                      'href',
                      'data:text/json;charset=utf-8,' +
                        encodeURIComponent(JSON.stringify(response)),
                    );
                    element.setAttribute('download', 'results.json');
                    element.click();
                  } else {
                    console.log(
                      'Error fetching scan:',
                      row.original.scans[getIndexOfNewestScan(row.original.scans)].id,
                    );
                  }
                }}
              >
                <DownloadIcon className="ml-1" aria-label="Download" />
              </button>
            )
          ) : (
            <></>
          ),
      },
    ]
    ,
    [],
  );

  // pagination
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // returns the index of the newest scan 
  const getIndexOfNewestScan = (scansArray:IPageScan[]) => {
    return scansArray.reduce((highestIndex, scan, index, arr) => 
      new Date(scan.updated_at).getTime() > 
      new Date(arr[highestIndex].updated_at).getTime() ? index : highestIndex, 0);
  }

  // data fetching
  const dataQuery = useQuery({
    queryKey: ['pages', pagination],
    queryFn: async () => {
      const theParams = {
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
      };
      console.log(theParams);
      return getPages({ params: theParams });
    },
    placeholderData: keepPreviousData,
  });

  const defaultData = React.useMemo(() => [], []);

  const table = useReactTable({
    data: dataQuery.data?.pages ?? defaultData,
    columns,
    // pageCount: dataQuery.data?.pageCount ?? -1, //you can now pass in `rowCount` instead of pageCount and `pageCount` will be calculated internally (new in v8.13.0)
    rowCount: dataQuery.data?.total, // new in v8.13.0 - alternatively, just pass in `pageCount` directly
    state: {
      pagination,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, //we're doing manual "server-side" pagination
    debugTable: true,
  });

  return (
    <>
      <SEO
        title="Pages - Equalify"
        description="Manage and monitor your properties on Equalify to improve their accessibility."
        url="https://dashboard.equalify.app/properties"
      />
      <div className="flex w-full flex-col-reverse justify-between sm:flex-row sm:items-center">
        <h1
          className="text-2xl font-bold md:text-3xl"
          id="properties-list-heading"
        >
          Pages
        </h1>
        <div className="flex flex-row items-center gap-2">
          <Link
            to="/pages/add"
            className="inline-flex h-9 items-center justify-end place-self-end whitespace-nowrap rounded-md bg-[#005031] px-4 py-3 text-base text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D781D] focus-visible:ring-offset-2 max-sm:w-fit max-sm:px-3 max-sm:py-2.5"
          >
            Add Pages
          </Link>
        </div>
      </div>

      {/* <div className="mt-7 text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            No Properties Added
          </h2>
          <p className="mt-2 text-gray-600">
            You haven't added any properties yet. Get started by adding your
            first property and monitor its accessibility status.
          </p>
          <Link
            to="/properties/add"
            className="mt-4 inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-[#005031] px-4 py-2 text-sm text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D781D] focus-visible:ring-offset-2"
          >
            Add Your First Property
          </Link>
        </div>  */}
      <section
        aria-labelledby="pages-list-heading"
        className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
      >
        <div className="w-full overflow-x-auto">
          <div className="p-2">
            <Table role="table" aria-label="Pages List">
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
              {table.getIsAllRowsSelected() || table.getIsSomeRowsSelected() ? (
                <tbody>
                  <tr>
                    <td colSpan={5} className="bg-green-100 p-2 px-4">
                      <button
                        className="rounded p-2 rounded-md border-1 border-slate-900 px-4 py-1 shadow bg-white"
                        onClick={() => sendSelectedPagesToScan()}
                      >
                        {`Scan ${table.getSelectedRowModel().flatRows.length} Pages`}
                      </button>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <></>
              )}
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
            <nav
              role="navigation"
              aria-label="Pagination Navigation"
              className="flex items-center gap-2"
            >
              <button
                className="rounded border p-1"
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {'<<'}
              </button>
              <button
                className="rounded border p-1"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {'<'}
              </button>
              <button
                className="rounded border p-1"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {'>'}
              </button>
              <button
                className="rounded border p-1"
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}
              >
                {'>>'}
              </button>
              <span className="flex items-center gap-1">
                <div>Page</div>
                <strong>
                  {table.getState().pagination.pageIndex + 1} of{' '}
                  {table.getPageCount().toLocaleString()}
                </strong>
              </span>
              <span className="flex items-center gap-1">
                | Go to page:
                <input
                  type="number"
                  min="1"
                  max={table.getPageCount()}
                  defaultValue={table.getState().pagination.pageIndex + 1}
                  onChange={(e) => {
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    table.setPageIndex(page);
                  }}
                  className="w-16 rounded border p-1"
                />
              </span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
              {dataQuery.isFetching ? 'Loading...' : null}
            </nav>

            <div>
              Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
              {dataQuery.data?.total.toLocaleString()}
            </div>
          </div>
        </div>
      </section>
      <a id="downloadReportLink" style={{ display: 'none' }}></a>
    </>
  );
};

export default Pages;

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  );
}
