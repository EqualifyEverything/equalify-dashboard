import { ColumnDef } from '@tanstack/react-table';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import Timeline from '~/components/charts/timeline';
import { SEO } from '~/components/layout';
import { DataTable } from '~/components/tables';
import { usePageDetails } from '~/graphql/hooks/usePageDetails';
import { Occurrence } from '~/graphql/types';
import { sendUrlToScan } from '~/services';

const PageDetails = () => {
  const { reportId = '', pageId = '' } = useParams();
  const { data, error } = usePageDetails(reportId, pageId);
  if (error) return <div role="alert">Error loading page details.</div>;

  const handleSendToScan = async () => {
    try {
      const response = await sendUrlToScan(pageId);
      if (response.status === 'success') {
        toast.success('Property sent to scan successfully!');
      } else {
        toast.error('Failed to send property to scan.');
      }
    } catch (error) {
      toast.error('An error occurred while sending the property to scan.');
      console.error(error);
    }
  };

  const ocurranceColumns: ColumnDef<Occurrence>[] = [
    {
      accessorKey: 'message',
      header: 'Message',
      cell: ({ row }) => (
        <Link
          to={`/reports/${reportId}/messages/${row.original.messageId}`}
          className="underline"
        >
          {row.getValue('message')}
        </Link>
      ),
    },
    {
      accessorKey: 'codeSnippet', header: 'Code Snippet',
      cell: ({ row }) => (
        <code>
          {row.getValue('codeSnippet')}
        </code>
      ),
    },
    { accessorKey: 'status', header: 'Status' },
  ];

  return (
    <div className="space-y-4">
      <SEO
        title={`${data?.url} - Page Details - Equalify`}
        description={`View the details of the ${data?.url} page, including associated messages and occurrences, on Equalify.`}
        url={`https://www.equalify.dev/reports/${reportId}/pages/${pageId}`}
      />
      <div className="flex w-full flex-col-reverse justify-between sm:flex-row sm:items-center">
        <div>
          <Link to={`/reports/${reportId}`} className="hover:underline">
            <h1
              id="report-details-heading"
              className="text-2xl font-bold md:text-3xl"
            >
              {data?.reportName}
            </h1>
          </Link>
          <a target='_blank' href={data?.url} className="text-lg text-blue-500 hover:underline">{data?.url}</a>
          <button onClick={handleSendToScan} className='ml-2 inline-flex h-9 items-center justify-end place-self-end whitespace-nowrap rounded-md bg-[#0d6efd] px-2 py-3 text-base text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0d6efd] focus-visible:ring-offset-2 max-sm:w-fit max-sm:px-1 gap-2 hover:opacity-50'>Send to Scan</button>
        </div>
        <Link
          to={`/reports/${reportId}/edit`}
          className="inline-flex h-9 items-center justify-end place-self-end whitespace-nowrap  rounded-md bg-[#005031] px-4 py-3 text-base text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D781D] focus-visible:ring-offset-2 max-sm:w-fit max-sm:px-3 max-sm:py-2.5"
        >
          Edit Report
        </Link>
      </div>

      <div className="rounded-lg bg-white p-4 shadow md:p-8">
        <Timeline data={data?.chart} />
      </div>

      <div className="overflow-x-auto rounded-lg bg-white p-4 shadow">
        <DataTable
          columns={ocurranceColumns}
          data={data?.nodes || []}
          type="messages"
        />
      </div>
    </div>
  );
};

export default PageDetails;
