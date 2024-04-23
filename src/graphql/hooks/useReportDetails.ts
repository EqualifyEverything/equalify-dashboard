import { useQueries } from '@tanstack/react-query';

import { mockReportDetails } from '../mocks/mock-report-details';
import { mockReports } from '../mocks/mock-reports';

export const useReportDetails = (reportId: string) => {
  const queryKeys = {
    messages: ['report', reportId, 'messages'] as const,
    pages: ['report', reportId, 'pages'] as const,
    tags: ['report', reportId, 'tags'] as const,
  };

  const queryResults = useQueries({
    queries: [
      {
        queryKey: queryKeys.messages,
        queryFn: () =>
          Promise.resolve(
            mockReportDetails.messages.filter((m) => m.reportId === reportId),
          ),
      },
      {
        queryKey: queryKeys.pages,
        queryFn: () =>
          Promise.resolve(
            mockReportDetails.pages.filter((p) => p.reportId === reportId),
          ),
      },
      {
        queryKey: queryKeys.tags,
        queryFn: () =>
          Promise.resolve(
            mockReportDetails.tags.filter((t) => t.reportId === reportId),
          ),
      },
    ],
  });

  const [messages, pages, tags] = queryResults;
  const reportName = mockReports.find((r) => r.id === reportId)?.name ?? '';

  const errors = [messages.error, pages.error, tags.error].filter(Boolean);
  const aggregatedError = errors.length ? errors : null;

  return {
    name: reportName,
    messagesData: messages.data ?? [],
    pagesData: pages.data ?? [],
    tagsData: tags.data ?? [],
    isLoading: messages.isLoading || pages.isLoading || tags.isLoading,
    error: aggregatedError,
  };
};
