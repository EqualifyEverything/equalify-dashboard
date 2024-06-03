import { ColumnDef } from '@tanstack/react-table';
import { Link, useParams } from 'react-router-dom';

import Timeline from '~/components/charts/timeline';
import { SEO } from '~/components/layout';
import { DataTable } from '~/components/tables';
import { useReportDetails } from '~/graphql/hooks/useReportDetails';
import { Message, Page, Tag } from '~/graphql/types';

const ReportDetails = () => {
  const { reportId = '' } = useParams();
  const { name, messagesData, pagesData, tagsData, error } = useReportDetails(
    reportId || '',
  );

  if (error) return <div role="alert">Error loading report details.</div>;

  const timelineData = [
    { date: '2021/01', equalified: 10, active: 5, ignored: 2 },
    { date: '2021/02', equalified: 15, active: 7, ignored: 3 },
    { date: '2021/03', equalified: 20, active: 10, ignored: 5 },
    { date: '2021/04', equalified: 25, active: 12, ignored: 6 },
    { date: '2021/05', equalified: 30, active: 15, ignored: 7 },
  ];

  const messageColumns: ColumnDef<Message>[] = [
    {
      accessorKey: 'title',
      header: 'Message',
      cell: ({ row }) => (
        <Link
          to={`/reports/${reportId}/messages/${row.original.messageId}`}
          className="underline"
        >
          {row.getValue('title')}
        </Link>
      ),
    },
    { accessorKey: 'equalifiedCount', header: 'Equalified' },
    { accessorKey: 'activeCount', header: 'Active' },
    { accessorKey: 'totalCount', header: 'Total' },
  ];

  const tagColumns: ColumnDef<Tag>[] = [
    {
      accessorKey: 'name',
      header: 'Tag',
      cell: ({ row }) => (
        <Link
          to={`/reports/${reportId}/tags/${row.original.tagId}`}
          className="underline"
        >
          {row.getValue('name')}
        </Link>
      ),
    },
    { accessorKey: 'referenceCount', header: 'Occurrences' },
  ];

  const pageColumns: ColumnDef<Page>[] = [
    {
      accessorKey: 'url',
      header: 'URL',
      cell: ({ row }) => (
        <Link
          to={`/reports/${reportId}/pages/${row.original.pageId}`}
          className="underline"
        >
          {row.getValue('url')}
        </Link>
      ),
    },
    { accessorKey: 'occurrencesActive', header: 'Active' },
  ];

  return (
    <div className="space-y-4">
      <SEO
        title={`${name} - Report Details - Equalify`}
        description={`View the details of the ${name} report, including messages, pages, and tags, on Equalify.`}
        url={`https://www.equalify.dev/reports/${reportId}`}
      />
      <div className="flex w-full flex-col-reverse justify-between sm:flex-row sm:items-center">
        <h1
          id="report-details-heading"
          className="text-2xl font-bold md:text-3xl"
        >
          {name}
        </h1>
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
          columns={messageColumns}
          data={messagesData}
          type="messages"
        />
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full overflow-x-auto rounded-lg bg-white p-4 shadow lg:w-1/2">
          <DataTable columns={tagColumns} data={tagsData} type="tags" />
        </div>
        <div className="w-full overflow-x-auto rounded-lg bg-white p-4 shadow lg:w-1/2">
          <DataTable columns={pageColumns} data={pagesData} type="pages" />
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
