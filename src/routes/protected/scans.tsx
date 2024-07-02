import { QueryClient, useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { useLoaderData } from 'react-router-dom';

import { SEO } from '~/components/layout';
import DataTable from '~/components/tables/data-table';
import { scansQuery } from '~/queries/scans';

interface Scan {
  jobId: string;
  createdAt: string;
  results: string;
  url: {
    id: string;
    url: string;
  };
  property: {
    id: string;
    name: string;
  };
  processing: boolean;
}

const scansColumns: ColumnDef<Scan>[] = [
  {
    accessorKey: 'jobId',
    header: 'Job ID',
    cell: ({ row }) => <span>{row.getValue('jobId')}</span>,
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => <span>{new Date(row.original.createdAt).toLocaleString()}</span>,
  },
  {
    accessorKey: 'url',
    header: 'URL',
    cell: ({ row }) => <a className='text-[blue] hover:opacity-50' target='_blank' href={row.original.url.url}>{row.original.url.url}</a>,
  },
  {
    accessorKey: 'property',
    header: 'Property',
    cell: ({ row }) => <span>{row.original.property.name}</span>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <span className={`${row.original.processing ? 'bg-[brown]' : 'bg-[green]'} text-[white] px-2 py-1 rounded-full`}>{row.original.processing ? 'Processing' : 'Complete'}</span>,
  },
  {
    accessorKey: 'report',
    header: 'Report',
    cell: ({ row }) => row.original.processing ? <span className='select-none text-[#666]'>Not ready</span> : <button className='text-[blue] hover:opacity-50' onClick={() => {
      const element = document.getElementById('downloadReportLink');
      element.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(row.original.results)));
      element.setAttribute("download", "results.json");
      element.click();
    }}>Download</button>,
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
    refetchInterval: 1000,
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
      <a id="downloadReportLink" style={{ display: 'none' }}></a>
    </>
  );
};

export default Scans;
