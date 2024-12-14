import { QueryClient, useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { Link, LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

import Timeline from '~/components/charts/timeline';
import { SEO } from '~/components/layout';
import { DataTable } from '~/components/tables';
import { messageDetailsQuery } from '~/queries';
import { assertNonNull } from '~/utils/safety';
import { post } from 'aws-amplify/api';
import { Modal } from '~/components/modals';

interface Node {
  pageUrl: string;
  pageId: number;
  codeSnippet: string;
  status: string;
}

/**
 * Loader function to fetch message details
 * @param queryClient - The Query Client instance.
 * @returns Loader function to be used with React Router.
 */
let suggestIndex = 0;
export const messageDetailsLoader =
  (queryClient: QueryClient) =>
    async ({ params }: LoaderFunctionArgs) => {
      assertNonNull(
        params.reportId,
        'Report ID is missing in the route parameters',
      );
      assertNonNull(
        params.messageId,
        'Message ID is missing in the route parameters',
      );

      const initialMessageDetails = await queryClient.ensureQueryData(
        messageDetailsQuery(params.reportId, params.messageId),
      );
      return {
        initialMessageDetails,
        reportId: params.reportId,
        messageId: params.messageId,
      };
    };

const MessageDetails = () => {
  const { initialMessageDetails, reportId, messageId } =
    useLoaderData() as Awaited<
      ReturnType<ReturnType<typeof messageDetailsLoader>>
    >;
  const { data, error } = useQuery({
    ...messageDetailsQuery(reportId, messageId),
    initialData: initialMessageDetails,
  });

  if (error) return <div role="alert">Error loading message details.</div>;

  const [suggestIssueResponse, setSuggestIssueResponse] = useState(null);
  const [open, setOpen] = useState(false);
  const suggestIssue = async ({ codeSnippet, pageUrl, index }) => {
    suggestIndex = index;
    setSuggestIssueResponse(null);
    setOpen(true);
    const response = await (await post({
      apiName: 'auth', path: '/ai/suggest-issue', options: {
        body: {
          reportId: reportId,
          reportName: data?.reportName,
          messageId: messageId,
          messageName: data?.messageName,
          dequeUrl: data?.moreInfoUrl,
          nodes: data?.nodes,
          codeSnippet,
          pageUrl,
        }
      }
    }).response).body.json();
    setSuggestIssueResponse(response);
    // if (!window.open(response?.url)) { window.location.href = response?.url }
  }

  useEffect(() => {
    if (!open) {
      document.querySelector(`#suggest-${suggestIndex}`)?.focus();
    }
  }, [open])

  const NodeColumns: ColumnDef<Node>[] = [
    {
      accessorKey: 'codeSnippet',
      header: 'Code Snippet',
      cell: ({ row }) => <code>{row.getValue('codeSnippet')}</code>,
    },
    {
      accessorKey: 'pageUrl',
      header: 'Page URL',
      cell: ({ row }) => (
        <Link
          to={`/reports/${reportId}/pages/${row.original.pageId}`}
          className="w-[25%] underline"
        >
          {row.getValue('pageUrl')}
        </Link>
      ),
    },
    { accessorKey: 'status', header: 'Status' },
    {
      accessorKey: 'suggestIssue',
      header: 'Action',
      cell: ({ row }) => (
        <button
          id={`suggest-${row.index}`}
          className={`inline-flex h-9 items-center justify-end gap-2 place-self-end whitespace-nowrap rounded-md px-2 py-3 text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0d6efd] focus-visible:ring-offset-2 max-sm:w-fit max-sm:px-1 ml-2 bg-[#0d6efd] hover:opacity-50 text-xs`}
          onClick={() => suggestIssue({ codeSnippet: row.getValue('codeSnippet'), pageUrl: row.getValue('pageUrl'), index: row.index })}
        >
          Suggest Issue
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-box-arrow-up-right"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"
            ></path>
            <path
              fill-rule="evenodd"
              d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"
            ></path>
          </svg>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <SEO
        title={`${data?.messageName} - Message Details - Equalify`}
        description={`View the details of the ${data?.messageName} message, including associated nodes and pages, on Equalify.`}
        url={`https://dashboard.equalify.app/reports/${reportId}/messages/${messageId}`}
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
          {data?.moreInfoUrl && (
            <a
              target="_blank"
              className="inline-flex h-9 items-center justify-end gap-2 place-self-end whitespace-nowrap rounded-md bg-[#0d6efd] px-2 py-3 text-base text-white shadow transition-colors hover:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0d6efd] focus-visible:ring-offset-2 max-sm:w-fit max-sm:px-1"
              href={data.moreInfoUrl}
            >
              More Info
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-box-arrow-up-right"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"
                ></path>
                <path
                  fill-rule="evenodd"
                  d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"
                ></path>
              </svg>
            </a>
          )}
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
          columns={NodeColumns}
          data={data?.nodes ?? []}
          type="messages"
        />
      </div>
      <Modal
        open={open}
        setOpen={setOpen}
      >
        <h1 className='text-2xl'>Suggest Issue</h1>
        <div role='status'>{!suggestIssueResponse ? `Generating issue... (1 min)` : `Issue generated`}</div>
        {suggestIssueResponse && <div className='overflow-y-scroll max-h-[500px]'>
          {JSON.stringify({ suggestIssueResponse: suggestIssueResponse?.how_to_implement })}
        </div>}
      </Modal>
    </div>
  );
};

export default MessageDetails;
