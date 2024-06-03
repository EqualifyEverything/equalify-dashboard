import { ColumnDef } from '@tanstack/react-table';
import { Link, useParams } from 'react-router-dom';

import Timeline from '~/components/charts/timeline';
import { SEO } from '~/components/layout';
import { DataTable } from '~/components/tables';
import { useMessageDetails } from '~/graphql/hooks/useMessageDetails';
import { Node } from '~/graphql/types';

const MessageDetails = () => {
  const { reportId = '', messageId = '' } = useParams();

  const { data, error } = useMessageDetails(reportId, messageId);

  if (error) return <div role="alert">Error loading message details.</div>;

  const timelineData = [
    { date: '2021/01', equalified: 10, active: 5, ignored: 2 },
    { date: '2021/02', equalified: 15, active: 7, ignored: 3 },
    { date: '2021/03', equalified: 20, active: 10, ignored: 5 },
    { date: '2021/04', equalified: 25, active: 12, ignored: 6 },
    { date: '2021/05', equalified: 30, active: 15, ignored: 7 },
  ];

  const NodeColumns: ColumnDef<Node>[] = [
    {
      accessorKey: 'codeSnippet',
      header: 'Code Snippet',
    },
    {
      accessorKey: 'pageUrl',
      header: 'Page URL',
      cell: ({ row }) => (
        <Link
          to={`/reports/${reportId}/pages/${row.original.pageId}`}
          className="underline"
        >
          {row.getValue('pageUrl')}
        </Link>
      ),
    },
    { accessorKey: 'status', header: 'Status' },
  ];

  return (
    <div className="space-y-4">
      <SEO
        title={`${data?.messageName} - Message Details - Equalify`}
        description={`View the details of the ${data?.messageName} message, including associated nodes and pages, on Equalify.`}
        url={`https://www.equalify.dev/reports/${reportId}/messages/${messageId}`}
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
          <p className="text-lg text-gray-500">{data?.messageName}</p>
        </div>
        <Link
          to={`/reports/${reportId}/edit`}
          className="inline-flex h-9 items-center justify-end place-self-end whitespace-nowrap  rounded-md bg-[#005031] px-4 py-3 text-base text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D781D] focus-visible:ring-offset-2 max-sm:w-fit max-sm:px-3 max-sm:py-2.5"
        >
          Edit Report
        </Link>
      </div>

      <div className="rounded-lg bg-white p-4 shadow md:p-8">
        <Timeline data={timelineData} />
      </div>

      <div className="overflow-x-auto rounded-lg bg-white p-4 shadow">
        <DataTable
          columns={NodeColumns}
          data={data?.messageDetails ?? []}
          type="messages"
        />
      </div>
    </div>
  );
};

export default MessageDetails;
