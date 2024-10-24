import React from 'react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { Link, useLoaderData } from 'react-router-dom';

import { SEO } from '~/components/layout';
import { pagesQuery } from '~/queries';
import { LoadingPages } from './loading';
import { getScan, IPage } from '~/services';
import DataTable from '~/components/tables/data-table';
import { ColumnDef } from '@tanstack/react-table';

export const pagesLoader = (queryClient: QueryClient) => async () => {
  const initialPages =
    await queryClient.ensureQueryData(pagesQuery({ limit: 50, offset: 0 }));
  return { initialPages };
};

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};


const pagesColumns: ColumnDef<IPage>[] = [
  {
    accessorKey: 'url',
    header: 'URL',
    cell: ({ row }) => <a className='text-blue-500 hover:opacity-50' target='_blank' href={row.original.url}>{row.original.url}</a>,
  },
  {
    accessorKey: 'property',
    header: 'Property',
    cell: ({ row }) => <span>{row.original.property?.name}</span>,
  },
  {
    accessorKey: 'lastScanned',
    header: 'Last Scanned At',
    cell: ({ row }) => <span>{new Date(row.original.scans[0].updated_at).toLocaleString()}</span>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <span className={`${row.original.scans[0].processing ? 'bg-[#663808]' : 'bg-[#005031]'} text-white px-2 py-1 rounded-full`}>{row.original.scans[0].processing ? 'Processing' : 'Complete'}</span>,
  }
];


const Pages = () => {
  const { initialPages } = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof pagesLoader>>
  >;
  const {
    data: pages,
    isLoading,
    error,
  } = useQuery({
    ...pagesQuery({ limit: 50, offset: 0 }),
    initialData: initialPages,
  });

  if (error) return <div>Error: {error.message}</div>;

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
        <div className='flex flex-row items-center gap-2'>
          <Link
            to="/properties/add"
            className="inline-flex h-9 items-center justify-end place-self-end whitespace-nowrap rounded-md bg-[#005031] px-4 py-3 text-base text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D781D] focus-visible:ring-offset-2 max-sm:w-fit max-sm:px-3 max-sm:py-2.5"
          >
            Add Pages
          </Link>
          <Link
            to="/properties/bulk"
            className="inline-flex h-9 items-center justify-end place-self-end whitespace-nowrap rounded-md bg-[#005031] px-4 py-3 text-base text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D781D] focus-visible:ring-offset-2 max-sm:w-fit max-sm:px-3 max-sm:py-2.5"
          >
            Bulk Upload CSV
          </Link>
        </div>
      </div>
      {isLoading ? (
        <LoadingPages />
      ) : pages.length === 0 ? (
        <div className="mt-7 text-center">
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
        </div>
      ) : (
        <section
          aria-labelledby="pages-list-heading"
          className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
        >
          
          <div className="w-full overflow-x-auto">
          {pages && (
            <DataTable columns={pagesColumns} data={pages ?? []} type="pages" />
          )}
        </div>
         
        </section>
      )}
    </>
  );
};

export default Pages;
