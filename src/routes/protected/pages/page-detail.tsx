import React, { useState } from 'react';
import {
  CheckCircledIcon,
  DownloadIcon,
  ExclamationTriangleIcon,
  ReloadIcon,
} from '@radix-ui/react-icons';
import { keepPreviousData, QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { format, formatDistance } from 'date-fns';
import { ActionFunctionArgs, Link, LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

import { toast } from '~/components/alerts';
import { Button } from '~/components/buttons';
import { SEO } from '~/components/layout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/tables';
import { pageDetailQuery } from '~/queries/pages';
import { getPageDetail, getScan, IPageScan, sendUrlsToScan } from '~/services';
import { assertNonNull } from '~/utils/safety';

// Initial data on pageload
export const pageDetailLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    assertNonNull(
      params.pageId,
      'Page ID is missing in the route parameters',
    );
    const initialPage = await queryClient.ensureQueryData(
      pageDetailQuery({ pageId: params.pageId }),
    );
    return { initialPage, pageId: params.pageId };
  };

const pageDetail = () => {
  // fetch the single page data
  const queryClient = useQueryClient();
  const { initialPage, pageId } = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof pageDetailLoader>>
  >;
  //const [data, setData] = useState(initialPage?.initialPage);
  const [isSendingToScan, setIsSendingToScan] = useState(false);

  const { data } = useQuery({
    ...pageDetailQuery({pageId: pageId!}),
    initialData: initialPage,
  });
  

  // Define the columns
  const columns = React.useMemo<ColumnDef<IPageScan>[]>(
    () => [
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => (
          <div>{format(new Date(row.original.updated_at), 'MM/dd/yy p')}</div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <div>
            {row.original?.processing === true ? (
              <ReloadIcon aria-label="Processing" className="animate-spin" />
            ) : null}
            {row.original?.processing === false ? (
              <CheckCircledIcon aria-label="Complete" />
            ) : null}
            {row.original?.processing !== true && row.original?.processing !== false ? (
              <ExclamationTriangleIcon aria-label="No Scans Found!" />
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: 'report',
        header: 'Results JSON',
        cell: ({ row }) =>
          row.original.processing ? (
            <span className="select-none text-[#666]">Not ready</span>
          ) : (
            <button
              className="inline-flex items-center text-blue-500 hover:opacity-50"
              onClick={async () => {
                const element = document.getElementById('downloadReportLink');
                if (element) {
                  const response = await getScan(row.original.id);
                  element.setAttribute(
                    'href',
                    'data:text/json;charset=utf-8,' +
                      encodeURIComponent(JSON.stringify(response)),
                  );
                  element.setAttribute('download', 'results.json');
                  element.click();
                } else {
                  console.log('Error fetching scan:', row.original.id);
                }
              }}
            >
              <DownloadIcon className="ml-1" aria-label="Download" />
            </button>
          ),
      },
    ],
    [],
  );

  const scansSortedByDate = data?.scans
    .slice()
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );

  const table = useReactTable({
    data: scansSortedByDate ?? [],
    columns,
    rowCount: scansSortedByDate?.length, // new in v8.13.0 - alternatively, just pass in `pageCount` directly
    getCoreRowModel: getCoreRowModel(),
    //debugTable: true,
  });

  const sendPageToScan = async () => {
    //setIsSendingToScan(true);
    const urlsToSend = [];
    if(data?.id ?? data?.url){
    urlsToSend.push(
      {
        url: data?.url,
        urlId: data?.id,
      });
    }else{
        console.log("Data error!");
        return;
    }

    try {
      const out = { urls: urlsToSend };
      const response = await sendUrlsToScan(out);

      if (response.status === 'success') {
        toast.success({
          title: 'Success',
          description: 'Pages sent to scan!',
        });
        queryClient.refetchQueries({ queryKey: ['page-detail']});
        //setData(await getPageDetail({ pageId: data.id})); // refresh the page
      } else {
        toast.error({
          title: 'Error',
          description: 'There was a problem sending to scan.',
        });
        console.log(out);
        console.log(response);
        throw new Response('There was a problem sending to scan', {
          status: 500,
        });
      }
      //setIsSendingToScan(false);
    } catch (error) {
      toast.error({
        title: 'Error',
        description: 'There was a problem sending to scan.',
      });
      //setIsSendingToScan(false);
      throw error;
    }
    return;
  };

  return (
    <>
      <SEO
        title="Pages - Equalify"
        description="Manage and monitor your pages on Equalify to improve their accessibility."
        url={`https://dashboard.equalify.app/pages/${pageId}`}
      />
      <div className="flex w-full flex-col-reverse justify-between sm:flex-row sm:items-center">
        <div className="flex flex-row items-center gap-2">
          <Link
            to="/pages"
            aria-label="Back to All Pages"
            className="text-[#186121]"
          >
            &#60; Back to All Pages
          </Link>
        </div>
      </div>
      <div className="inline-flex w-full justify-between">
        <section
          aria-labelledby="page-detail-heading"
          className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
        >
          <dl className="">
            <>
              <dt className="text-sm font-bold">URL</dt>
              <dd id="page-detail-heading">{data?.url}</dd>
            </>
            <>
              <dt className="text-sm font-bold">Added</dt>
              <dd>
                {data?.created_at &&
                  formatDistance(new Date(data?.created_at), new Date(), {
                    addSuffix: true,
                  })}
              </dd>
            </>
            <>
              <dt className="text-sm font-bold">Equalify ID</dt>
              <dd className="text-sm">{data?.id}</dd>
            </>
            <>
              <dt className="text-sm font-bold">Property</dt>
              <dd className="text-sm">{data?.property?.name}</dd>
            </>
          </dl>
        </section>
        <section aria-label="Actions" className="space-y-6 p-6">
          <Button
            className="w-fit bg-[#1D781D] text-white"
            disabled={isSendingToScan}
            aria-disabled={isSendingToScan}
            aria-live="polite"
            onClick={sendPageToScan}
          >
            {isSendingToScan ? (
              <>
                <span className="sr-only">Processing, please wait...</span>
                <div
                  role="status"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"
                ></div>
              </>
            ) : (
              'Scan Page'
            )}
          </Button>
        </section>
      </div>
      <section
        aria-labelledby="page-detail-scans-heading"
        className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
      >
        <h3 id="page-detail-scans-heading" className="text-md">
          Scans
        </h3>
        {table.getRowCount() === 0 ? (
          <div className="mt-7 text-center">
            <h2 className="text-xl font-semibold text-gray-700">
              No Scans Found
            </h2>
            <p className="mt-2 text-gray-600">
              You haven't scanned this page yet.
            </p>
          </div>
        ) : (
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
        )}
      </section>
      <a id="downloadReportLink" style={{ display: 'none' }}></a>
    </>
  );
};
export default pageDetail;
