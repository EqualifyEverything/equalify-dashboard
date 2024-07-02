import { useQuery } from '@tanstack/react-query';

import { mockReportDetails } from '../mocks/mock-report-details';
import { mockReports } from '../mocks/mock-reports';

import { Message } from '../types';

interface TagDetailsQueryData {
  messages: Message[];
  reportName: string;
  tagName: string;
}

const fetchTagDetails = async (
  reportId: string,
  tagId: string,
): Promise<TagDetailsQueryData> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const reportName =
    mockReports.find((report) => report.id === reportId)?.name || '';
  const tagName =
    mockReportDetails.tags.find(
      (tag) => tag.tagId.toString() === tagId && tag.reportId === reportId,
    )?.name || '';

  const messages = mockReportDetails.messages
    .filter(
      (message) =>
        message.reportId === reportId && message.tags.includes(tagId),
    );

  return { reportName, tagName, messages };
};

export const useTagDetails = (reportId: string, tagId: string) => {
  return useQuery<TagDetailsQueryData>({
    queryKey: ['report', reportId, 'tag', tagId],
    queryFn: () => fetchTagDetails(reportId, tagId),
    refetchOnWindowFocus: true,
    gcTime: 10 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });
};
