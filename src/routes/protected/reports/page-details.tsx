import { useState } from 'react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Link, LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { toast } from '~/components/alerts';

import { Button } from '~/components/buttons';
import Timeline from '~/components/charts/timeline';
import { SEO } from '~/components/layout';
import { DataTable } from '~/components/tables';
import { pageDetailsQuery } from '~/queries';
import { sendUrlToScan } from '~/services';
import { assertNonNull } from '~/utils/safety';

interface Occurrence {
  messageId: number;
  title: string;
  codeSnippet: string;
  status: string;
}

/**
 * Loader function to fetch page details
 * @param queryClient - The Query Client instance.
 * @returns Loader function to be used with React Router.
 */
export const pageDetailsLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    assertNonNull(
      params.reportId,
      'Report ID is missing in the route parameters',
    );
    assertNonNull(params.pageId, 'Page ID is missing in the route parameters');

    const initialPageDetails = await queryClient.ensureQueryData(
      pageDetailsQuery(params.reportId, params.pageId),
    );
    return {
      initialPageDetails,
      reportId: params.reportId,
      pageId: params.pageId,
    };
  };

const PageDetails = () => {
  const { initialPageDetails, reportId, pageId } = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof pageDetailsLoader>>
  >;
  const { data, error } = useQuery({
    ...pageDetailsQuery(reportId, pageId),
    initialData: initialPageDetails,
  });

  const [isSending, setIsSending] = useState(false);

  if (error) return <div role="alert">Error loading page details.</div>;

  const handleSendToScan = async () => {
    setIsSending(true);
    try {
      const response = await sendUrlToScan(pageId);
      if (response.status === 'success') {
        toast.success({ title: 'Success', description: 'Property sent to scan successfully!' });
      } else {
        toast.error({ title: 'Error', description: 'Failed to send property to scan.' });
      }
    } catch (error) {
      toast.error({ title: 'Error', description: 'An error occurred while sending the property to scan.' });
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const ocurranceColumns: ColumnDef<Occurrence>[] = [
    {
      accessorKey: 'codeSnippet',
      header: 'Code Snippet',
      cell: ({ row }) => <code>{row.getValue('codeSnippet')}</code>,
    },
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
    { accessorKey: 'status', header: 'Status' },
  ];

  return (
    <div className="space-y-4">
      <SEO
        title={`${data?.url} - Page Details - Equalify`}
        description={`View the details of the ${data?.url} page, including associated messages and occurrences, on Equalify.`}
        url={`https://dashboard.equalify.app/reports/${reportId}/pages/${pageId}`}
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
          <a
            target="_blank"
            href={data?.url}
            className="text-lg text-blue-500 hover:underline"
          >
            {data?.url}
          </a>
          <Button
            className="w-fit justify-end place-self-end bg-[#005031]"
            onClick={handleSendToScan}
            disabled={isSending}
            aria-disabled={isSending}
          >
            {isSending ? 'Sending...' : 'Send to Scan'}
          </Button>
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
