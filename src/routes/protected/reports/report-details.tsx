import { QueryClient, useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Link, LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

import Timeline from '~/components/charts/timeline';
import { SEO } from '~/components/layout';
import { DataTable } from '~/components/tables';
import { reportDetailsQuery } from '~/queries';
import { assertNonNull } from '~/utils/safety';

interface Message {
  id: string;
  messageId: number;
  title: string;
  activeCount: number;
}

interface Page {
  id: string;
  pageId: number;
  url: string;
  occurrencesActive: number;
}
interface Tag {
  id: string;
  tagId: number;
  name: string;
  referenceCount: number;
}

/**
 * Loader function to fetch reports details
 * @param queryClient - The Query Client instance.
 * @returns Loader function to be used with React Router.
 */
export const reportDetailsLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    assertNonNull(
      params.reportId,
      'Report ID is missing in the route parameters',
    );

    const initialReportDetail = await queryClient.ensureQueryData(
      reportDetailsQuery(params.reportId),
    );
    return { initialReportDetail, reportId: params.reportId };
  };

const ReportDetails = () => {
  const { initialReportDetail, reportId } = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof reportDetailsLoader>>
  >;

  const { data: details, error } = useQuery({
    ...reportDetailsQuery(reportId!),
    initialData: initialReportDetail,
  });

  if (error) return <div role="alert">Error loading report details.</div>;

  const {
    urls: pagesData,
    messages: messagesData,
    tags: tagsData,
    reportName,
    chart,
  } = details;

  const messageColumns: ColumnDef<Message>[] = [
    {
      accessorKey: 'message',
      header: 'Message',
      cell: ({ row }) => (
        <Link
          to={`/reports/${reportId}/messages/${row.original.id}`}
          className="underline"
        >
          {row.getValue('message')}
        </Link>
      ),
    },
    { accessorKey: 'equalifiedCount', header: 'Equalified' },
    { accessorKey: 'activeCount', header: 'Active' },
    { accessorKey: 'totalCount', header: 'Total' },
  ];

  const tagColumns: ColumnDef<Tag>[] = [
    {
      accessorKey: 'tag',
      header: 'Tag',
      cell: ({ row }) => (
        <Link
          to={`/reports/${reportId}/tags/${row.original.id}`}
          className="underline"
        >
          {row.getValue('tag')}
        </Link>
      ),
    },
    // { accessorKey: 'referenceCount', header: 'Occurrences' },
  ];

  const pageColumns: ColumnDef<Page>[] = [
    {
      accessorKey: 'url',
      header: 'URL',
      cell: ({ row }) => (
        <Link
          to={`/reports/${reportId}/pages/${row.original.id}`}
          className="underline"
        >
          {row.getValue('url')}
        </Link>
      ),
    },
    // { accessorKey: 'occurrencesActive', header: 'Active' },
  ];

  return (
    <div className="space-y-4">
      <SEO
        title={`${reportName} - Report Details - Equalify`}
        description={`View the details of the ${reportName} report, including messages, pages, and tags, on Equalify.`}
        url={`https://www.equalify.dev/reports/${reportId}`}
      />
      <div className="flex w-full flex-col-reverse justify-between sm:flex-row sm:items-center">
        <h1
          id="report-details-heading"
          className="text-2xl font-bold md:text-3xl"
        >
          {reportName}
        </h1>
        <Link
          to={`/reports/${reportId}/edit`}
          className="inline-flex h-9 items-center justify-end place-self-end whitespace-nowrap  rounded-md bg-[#005031] px-4 py-3 text-base text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D781D] focus-visible:ring-offset-2 max-sm:w-fit max-sm:px-3 max-sm:py-2.5"
        >
          <span className="sr-only">{`Edit ${reportName} Report`}</span>
          <span aria-hidden="true">Edit Report</span>
        </Link>
      </div>

      <div className="rounded-lg bg-white p-4 shadow md:p-8">
        <Timeline data={chart} />
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
