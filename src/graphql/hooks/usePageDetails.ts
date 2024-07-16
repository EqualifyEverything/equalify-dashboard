import { useQuery } from '@tanstack/react-query';
import { getPageDetails } from '~/services';

interface Occurrence {
  pageId: number;
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

const fetchPageDetails = async (reportId: string, pageId: string) => {
  const details = await getPageDetails(reportId, pageId);
  if (!details) {
    throw new Response('', {
      status: 404,
      statusText: 'Page Details Not Found',
    });
  }
  return details;
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
