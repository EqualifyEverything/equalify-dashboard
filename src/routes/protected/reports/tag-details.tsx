import { QueryClient, useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Link, LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

import Timeline from '~/components/charts/timeline';
import { SEO } from '~/components/layout';
import { DataTable } from '~/components/tables';
import { tagDetailsQuery } from '~/queries';
import { assertNonNull } from '~/utils/safety';

interface Message {
  id: string;
  messageId: number;
  title: string;
  activeCount: number;
}

/**
 * Loader function to fetch tag details
 * @param queryClient - The Query Client instance.
 * @returns Loader function to be used with React Router.
 */
export const tagDetailsLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    assertNonNull(
      params.reportId,
      'Report ID is missing in the route parameters',
    );
    assertNonNull(params.tagId, 'Tag ID is missing in the route parameters');

    const initialTagDetails = await queryClient.ensureQueryData(
      tagDetailsQuery(params.reportId, params.tagId),
    );
    return {
      initialTagDetails,
      reportId: params.reportId,
      tagId: params.tagId,
    };
  };

const TagDetails = () => {
  const { initialTagDetails, reportId, tagId } = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof tagDetailsLoader>>
  >;
  const { data, error } = useQuery({
    ...tagDetailsQuery(reportId, tagId),
    initialData: initialTagDetails,
  });

  if (error) return <div role="alert">Error loading tag details.</div>;

  const messageColumns: ColumnDef<Message>[] = [
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
    { accessorKey: 'equalifiedCount', header: 'Equalified' },
    { accessorKey: 'activeCount', header: 'Active' },
    { accessorKey: 'totalCount', header: 'Total' },
  ];
  return (
    <div className="space-y-4">
      <SEO
        title={`${data?.tagName} - Tag Details - Equalify`}
        description={`View the details of the ${data?.tagName} tag, including associated messages, on Equalify.`}
        url={`https://www.equalify.dev/reports/${reportId}/tags/${tagId}`}
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
          <p className="text-lg text-gray-500">{data?.tagName}</p>
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
          columns={messageColumns}
          data={data?.messages || []}
          type="messages"
        />
      </div>
    </div>
  );
};

export default TagDetails;
