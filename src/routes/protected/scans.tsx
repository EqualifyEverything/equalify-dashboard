import { Button } from '~/components/buttons';
import DataTable from '~/components/tables/data-table';
import { ColumnDef } from '@tanstack/react-table';

interface Scan {
  jobId: string;
  page: string;
  url: string;
  property: string;
}

const scansData: Scan[] = [];

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
  return (
    <>
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

        <DataTable columns={scansColumns} data={scansData} type="scans" />
      </section>
    </>
  );
};

export default Scans;
