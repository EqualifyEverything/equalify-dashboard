import { useQuery } from '@tanstack/react-query';

import { mockMessageDetails as rawMockMessageDetails } from '../mocks/mock-message-details';
import { mockReportDetails } from '../mocks/mock-report-details';
import { mockReports } from '../mocks/mock-reports';

interface MessageDetail {
  pageUrl: string;
  pageId: number;
  codeSnippet: string;
  status: string;
}

interface MessageDetailsByMessage {
  [messageId: string]: MessageDetail[];
}

interface MessageDetailsByReport {
  [reportId: string]: MessageDetailsByMessage;
}

interface MessageDetailsQueryData {
  messageDetails: MessageDetail[];
  reportName: string;
  messageName: string;
}

const mockMessageDetails: MessageDetailsByReport =
  rawMockMessageDetails as MessageDetailsByReport;
const fetchMessageDetails = async (
  reportId: string,
  messageId: string,
): Promise<MessageDetailsQueryData> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const messageDetails = mockMessageDetails[reportId]?.[messageId] || [];
  const reportName =
    mockReports.find((report) => report.id === reportId)?.name || '';
  const messageName =
    mockReportDetails.messages.find(
      (message) => message.messageId.toString() === messageId,
    )?.title || '';

  return { messageDetails, reportName, messageName };
};

export const useMessageDetails = (reportId: string, messageId: string) => {
  return useQuery<MessageDetailsQueryData>({
    queryKey: ['report', reportId, 'message', messageId],
    queryFn: () => fetchMessageDetails(reportId, messageId),
    refetchOnWindowFocus: true,
    gcTime: 10 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });
};
