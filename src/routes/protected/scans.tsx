import { QueryClient, useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { useLoaderData } from 'react-router-dom';

import { SEO } from '~/components/layout';
import DataTable from '~/components/tables/data-table';
import { scansQuery } from '~/queries/scans';

interface Scan {
  jobId: string;
  page: string;
  url: string;
  property: string;
}

const scansColumns: ColumnDef<Scan>[] = [
  {
    accessorKey: 'jobId',
    header: 'Job ID',
    cell: ({ row }) => <span>{row.getValue('jobId')}</span>,
  },
  {
    accessorKey: 'page',
    header: 'Page',
    cell: ({ row }) => <span>{row.getValue('page')}</span>,
  },
  {
    accessorKey: 'url',
    header: 'URL',
    cell: ({ row }) => <span>{row.getValue('url')}</span>,
  },
  {
    accessorKey: 'property',
    header: 'Property',
    cell: ({ row }) => <span>{row.getValue('property')}</span>,
  },
];

export const scansLoader = (queryClient: QueryClient) => async () => {
  const initialScans = await queryClient.ensureQueryData(scansQuery());
  return { initialScans };
};

const Scans = () => {
  const { initialScans } = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof scansLoader>>
  >;
  const { data: scans, isLoading } = useQuery({
    ...scansQuery(),
    initialData: initialScans,
  });

  return (
    <>
      <SEO
        title="Scans - Equalify"
        description="View and manage your scans on Equalify."
        url="https://www.equalify.dev/scans"
      />

      <h1 id="scans-heading" className="text-2xl font-bold md:text-3xl">
        Scans
      </h1>

      <section
        aria-labelledby="queue-heading"
        className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
      >
        <h2 id="queue-heading" className="text-lg">
          Queue
        </h2>
        <div className="w-full overflow-x-auto">
          {scans && (
            <DataTable columns={scansColumns} data={scans ?? []} type="scans" />
          )}
        </div>
      </section>
    </>
  );
};

export default Scans;
