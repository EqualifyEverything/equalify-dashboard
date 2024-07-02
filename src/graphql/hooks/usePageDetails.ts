import { useQuery } from '@tanstack/react-query';

import { mockPageDetails as rawMockPageDetails } from '../mocks/mock-page-details';
import { mockReports } from '../mocks/mock-reports';

interface Occurrence {
  messageId: number;
  title: string;
  occurrenceId: number;
  codeSnippet: string;
  status: string;
}

interface PageDetails {
  url: string;
  occurrences: Occurrence[];
}

interface PageDetailsData {
  [reportId: string]: {
    [pageId: string]: PageDetails;
  };
}

const mockPageDetails: PageDetailsData = rawMockPageDetails as PageDetailsData;

const fetchPageDetails = async (reportId: string, pageId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const pageDetails = mockPageDetails[reportId]?.[pageId] || {};
  const reportName =
    mockReports.find((report) => report.id === reportId)?.name || '';
  return { ...pageDetails, reportName };
};

export const usePageDetails = (reportId: string, pageId: string) => {
  return useQuery({
    queryKey: ['report', reportId, 'page', pageId],
    queryFn: () => fetchPageDetails(reportId, pageId),
    refetchOnWindowFocus: true,
    gcTime: 10 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });
};
