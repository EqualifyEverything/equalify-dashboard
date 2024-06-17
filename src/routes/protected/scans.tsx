import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '~/components/buttons';
import { SEO } from '~/components/layout';
import DataTable from '~/components/tables/data-table';
import * as API from "aws-amplify/api";

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
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Button
        onClick={() => console.log('Processing job:', row.original.jobId)}
        aria-label={`Process job ${row.original.jobId}`}
      >
        Process
      </Button>
    ),
  },
];

const Scans = () => {
  const { data: scans } = useQuery({
    queryKey: ['scans'],
    queryFn: async () => await (await API.get({ apiName: 'auth', path: '/get/scans' }).response).body.json() as unknown as Scan[],
  });

  return (
    <>
      <SEO
        title="Scans - Equalify"
        description="View and manage your scans on Equalify."
        url="https://www.equalify.dev/scans"
      />
      <div className="flex w-full flex-col-reverse justify-between sm:flex-row sm:items-center">
        <h1 id="scans-heading" className="text-2xl font-bold md:text-3xl">
          Scans
        </h1>
        <Button
          onClick={() => console.log('Process scans')}
          className="w-fit gap-2 place-self-end bg-[#005031]"
          aria-label="Process all scans"
        >
          Process All Scans
        </Button>
      </div>

      <section
        aria-labelledby="queue-heading"
        className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
      >
        <h2 id="queue-heading" className="text-lg">
          Queue
        </h2>
        <div className="w-full overflow-x-auto">
          {scans && <DataTable columns={scansColumns} data={scans?.result ?? []} type="scans" />}
        </div>
      </section>
    </>
  );
};

export default Scans;
