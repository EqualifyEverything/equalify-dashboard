import { useState } from 'react';
import { CheckCircledIcon, ChevronDownIcon, ChevronUpIcon, DownloadIcon, ExclamationTriangleIcon, ReloadIcon } from '@radix-ui/react-icons';
import {
  keepPreviousData,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  ActionFunctionArgs,
  Link,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useNavigate,
} from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/tables';

import * as Select from '@radix-ui/react-select';
import { toast } from '~/components/alerts';
import { Button } from '~/components/buttons';
import { DangerDialog } from '~/components/dialogs';
import { PropertyForm } from '~/components/forms';
import { SEO } from '~/components/layout';
import { propertyQuery } from '~/queries/properties';
import { deleteProperty, getProperties, getPropertyById, getScan, IPage, IPageScan, sendToScan, updateProperty } from '~/services';
import { assertNonNull } from '~/utils/safety';
import { LoadingProperty } from './loading';
import { ColumnDef, flexRender, getCoreRowModel, PaginationState, useReactTable } from '@tanstack/react-table';
import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

/**
 * Loader function to fetch property data
 * @param queryClient - The Query Client instance.
 * @returns Loader function to be used with React Router.
 */
export const propertyLoader =
  (queryClient: QueryClient) =>
    async ({ params }: LoaderFunctionArgs) => {
      assertNonNull(
        params.propertyId,
        'Property ID is missing in the route parameters',
      );

      const initialProperty = await queryClient.ensureQueryData(
        propertyQuery({property_id:params.propertyId, offset:0, limit:0}),
      );
      return { initialProperty, propertyId: params.propertyId };
    };

/**
 * Handles updating a property.
 * @param queryClient - The Query Client instance.
 * @returns Action function to be used with React Router.
 */
export const updatePropertyAction =
  (queryClient: QueryClient) =>
    async ({ request, params }: ActionFunctionArgs) => {
      assertNonNull(params.propertyId, 'No property ID provided');

      try {
        const formData = await request.formData();
        const propertyName = formData.get('propertyName') as string;
        const propertyUrl = formData.get('propertyUrl') as string;
        const propertyDiscovery = formData.get('propertyDiscovery') as string;

        const response = await updateProperty(
          params.propertyId,
          propertyName,
          propertyUrl,
          propertyDiscovery,
        );

        await queryClient.invalidateQueries({
          queryKey: ['property', params.propertyId],
        });
        await queryClient.invalidateQueries({ queryKey: ['properties'] });

        if (response.status === 'success') {
          toast.success({ title: 'Success', description: 'Property updated successfully!' });
          return redirect(`/properties`);
        } else {
          toast.error({ title: 'Error', description: 'Failed to update property.' });
          throw new Response('Failed to update property', { status: 500 });
        }
      } catch (error) {
        toast.error({ title: 'Error', description: 'An error occurred while updating the property.' });
        throw error;
      }
    };

const EditProperty = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { initialProperty, propertyId } = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof propertyLoader>>
  >;

  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const { data: property, isLoading } = useQuery({
    ...propertyQuery({ property_id: propertyId!, offset:0, limit:10}),
    initialData: initialProperty,
  });

  // pagination
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: () => {
      const response = deleteProperty(propertyId!);
      queryClient.refetchQueries({ queryKey: ['filters'] });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success({ title: 'Success', description: 'Property deleted successfully!' });
      navigate('/properties');
    },
    onError: () => {
      toast.error({ title: 'Error', description: 'Failed to delete property.' });
    },
  });

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'propertyName' && value.trim() !== property?.name.trim()) {
      setIsFormChanged(true);
    } /* else if (
      name === 'propertyUrl' &&
      value.trim() !== property?.propertyUrl.trim()
    ) {
      setIsFormChanged(true);
    } else if (name === 'propertyDiscovery' && value !== property?.discovery) {
      setIsFormChanged(true);
    }*/ else {
      setIsFormChanged(false);
    } 
  };

  const handleDeleteProperty = async () => {
    deleteMutate();
  };

  const handleSendToScan = async () => {
    setIsSending(true);
    try {
      const response = await sendToScan(propertyId);
      if (response.status === 'success') {
        toast.success({ title: 'Success', description: 'Property sent to scan successfully!' });
      } else if (response.status === 'user_not_validated') {
        toast.error({ title: 'Error', description: `We must validate your account before permitting sitemap scans.` });
      } else {
        toast.error({ title: 'Error', description: 'Failed to send property to scan.' });
      }
    } catch (error) {
      toast.error({ title: 'Error', description: 'An error occurred while sending the property to scan.' });
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  // returns the index of the newest scan
  const getIndexOfNewestScan = (scansArray: IPageScan[]) => {
    return scansArray.reduce(
      (highestIndex, scan, index, arr) =>
        new Date(scan.updated_at).getTime() >
        new Date(arr[highestIndex].updated_at).getTime()
          ? index
          : highestIndex,
      0,
    );
  };
  
   // Define the columns
   const columns = React.useMemo<ColumnDef<IPage>[]>(
    () => [
      {
        accessorKey: 'url',
        header: 'URL',
        cell: ({ row }) => (
          <Link
            className="text-blue-500 hover:opacity-50"
            to={'./'+row.original.id}
          >
            {row.original.url}
          </Link>
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
              ):(
              
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
                              row.original.scans[
                                getIndexOfNewestScan(row.original.scans)
                              ].updated_at,
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
              <ExclamationTriangleIcon aria-label="No Scans Found!"/>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'report',
        header: 'Results JSON',
        cell: ({ row }) =>
          row.original?.scans.length > 0 ? (
            row.original.scans[getIndexOfNewestScan(row.original.scans)]
              .processing ? (
              <span className="select-none text-[#666]">Not ready</span>
            ) : (
              <button
                className="inline-flex items-center text-blue-500 hover:opacity-50"
                onClick={async () => {
                  const element = document.getElementById('downloadReportLink');
                  if (element) {
                    const response = await getScan(
                      row.original.scans[
                        getIndexOfNewestScan(row.original.scans)
                      ].id,
                    );
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
                      row.original.scans[
                        getIndexOfNewestScan(row.original.scans)
                      ].id,
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
    ],
    [],
  );

  // data fetching
    const defaultData = React.useMemo(() => [], []);
    const dataQuery = useQuery({
    queryKey: ['property', pagination],
    queryFn: async () => {
      /* const theParams = {
        property_id: propertyId,
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
      };
      console.log(theParams); */
      return getPropertyById(propertyId, pagination.pageSize,pagination.pageIndex * pagination.pageSize  );
    },
    placeholderData: keepPreviousData,
  });  
  const table = useReactTable({
    data: dataQuery.data?.urls as IPage[] ?? defaultData,
    columns,
    // pageCount: dataQuery.data?.pageCount ?? -1, //you can now pass in `rowCount` instead of pageCount and `pageCount` will be calculated internally (new in v8.13.0)
    rowCount: dataQuery.data?.urls_aggregate.aggregate.count, // new in v8.13.0 - alternatively, just pass in `pageCount` directly
    state: {
      pagination,
    },
    enableRowSelection: false,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, //we're doing manual "server-side" pagination
    //debugTable: true,
  });

  
  return (
    <>
      <SEO
        title={`Edit ${property?.name || 'Property'} - Equalify`}
        description={`Edit the details of ${property?.name || 'this property'} on Equalify.`}
        url={`https://dashboard.equalify.app/properties/${propertyId}/edit`}
      />

      <div className="flex w-full flex-col-reverse justify-between sm:flex-row sm:items-center">
        <h1
          id="edit-property-heading"
          className="text-2xl font-bold md:text-3xl"
        >
          Edit {property?.name || 'Property'}
        </h1>

        <Button
          className="w-fit justify-end place-self-end bg-[#005031]"
          onClick={handleSendToScan}
          disabled={isSending}
          aria-disabled={isSending}
        >
          {isSending ? 'Sending...' : 'Send to Scan'}
        </Button>
      </div>

      <section
        aria-labelledby="edit-property-heading"
        className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
        aria-live="polite"
      >
        {isLoading ? (
          <LoadingProperty />
        ) : (
          <PropertyForm
            actionUrl={`/properties/${propertyId}/edit`}
            defaultValues={{
              propertyName: property?.name || '',
              //propertyUrl: property?.propertyUrl || '',
              //propertyDiscovery: property?.discovery || 'single',
            }}
            formId="edit-property-form"
            onChange={handleFormChange}
          />
        )}

        <div className="space-x-6">
          <Button
            variant={'outline'}
            className="w-fit"
            onClick={() => navigate('/properties')}
            aria-label="Cancel editing property"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-property-form"
            className="w-fit bg-[#1D781D] text-white"
            disabled={!isFormChanged}
            aria-disabled={!isFormChanged}
            aria-live="polite"
          >
            Update Property
          </Button>
        </div>
      </section>

      {table.getRowCount() === 0 ? (
        <div className="mt-7 text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            No Pages Added
          </h2>
          <p className="mt-2 text-gray-600">
            You haven't added any pages yet. Get started by adding your first
            page and monitor its accessibility status.
          </p>
          <Link
            to="/pages/add"
            className="mt-4 inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-[#005031] px-4 py-2 text-sm text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D781D] focus-visible:ring-offset-2"
          >
            Add Your First Page
          </Link>
        </div>
      ) : (
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
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        role="row"
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
                className="flex items-center gap-2 pt-2"
              >
                <button
                  className="hover:bg-accent hover:text-accent-foreground hidden h-8 w-8 items-center justify-center whitespace-nowrap rounded-md border border-gray-300 bg-transparent p-0 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D781D] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 lg:flex"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  {'<<'}
                </button>
                <button
                  className="hover:bg-accent hover:text-accent-foreground hidden h-8 w-8 items-center justify-center whitespace-nowrap rounded-md border border-gray-300 bg-transparent p-0 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D781D] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 lg:flex"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  {'<'}
                </button>
                <button
                  className="hover:bg-accent hover:text-accent-foreground hidden h-8 w-8 items-center justify-center whitespace-nowrap rounded-md border border-gray-300 bg-transparent p-0 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D781D] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 lg:flex"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  {'>'}
                </button>
                <button
                  className="hover:bg-accent hover:text-accent-foreground hidden h-8 w-8 items-center justify-center whitespace-nowrap rounded-md border border-gray-300 bg-transparent p-0 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D781D] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 lg:flex"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                >
                  {'>>'}
                </button>
                <span className="flex w-[100px] items-center justify-center text-sm font-medium">
                  Page {table.getState().pagination.pageIndex + 1} of{' '}
                  {table.getPageCount().toLocaleString()}
                </span>
                {/* <span className="flex w-[100px] items-center justify-center text-sm font-medium">
                  <span>| Go to page:</span>
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
                </span> */}
                <Select.Root
                  value={table.getState().pagination.pageSize.toString()}
                  onValueChange={(val) => {
                    table.setPageSize(Number(val));
                  }}
                >
                  <Select.Trigger
                    className="SelectTrigger border border-slate-200"
                    aria-label="Pagination Page Size"
                  >
                    <Select.Value placeholder="Select Pages to Show…" />
                    <Select.Icon className="SelectIcon">
                      <ChevronDownIcon />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="SelectContent">
                      <Select.ScrollUpButton className="SelectScrollButton">
                        <ChevronUpIcon />
                      </Select.ScrollUpButton>
                      <Select.Viewport className="SelectViewport">
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                          <Select.Item
                            value={pageSize.toString()}
                            key={pageSize}
                            className="cursor-pointer p-2 hover:bg-green-100"
                          >
                            <Select.ItemText>Show {pageSize}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                      <Select.ScrollDownButton className="SelectScrollButton">
                        <ChevronDownIcon />
                      </Select.ScrollDownButton>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
                {dataQuery.isFetching ? <ReloadIcon aria-label="Loading..." className="animate-spin" /> : null}
                <div className="w-[200px] items-center justify-center text-sm font-medium">
                Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
                {dataQuery.data?.urls_aggregate.aggregate.count.toLocaleString()}
              </div>
              </nav>

             
            </div>
          </div>
          <a id="downloadReportLink" style={{ display: 'none' }}></a>
        </section>
      )}

      <section
        aria-labelledby="danger-zone-heading"
        className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
        aria-live="polite"
      >
        <h2 id="danger-zone-heading" className="text-lg text-[#cf000f]">
          Danger Zone
        </h2>

        <DangerDialog
          title="Confirm Property Deletion"
          description="Are you sure you want to delete your property? This action cannot be undone."
          onConfirm={handleDeleteProperty}
          triggerButton={
            <Button
              className="gap-2 bg-[#cf000f]"
              aria-describedby="delete-property-description"
              aria-label="Delete property"
            >
              Delete Property
              <ExclamationTriangleIcon aria-hidden />
            </Button>
          }
        />
        <p
          id="delete-property-description"
          className="mt-2 text-sm text-gray-600"
        >
          Deleting your property is irreversible. Please proceed with caution.
        </p>
      </section>
    </>
  );
};

export default EditProperty;
