import { useQuery } from '@tanstack/react-query';
import { getMessageDetails } from '~/services';

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

const fetchMessageDetails = async (
  reportId: string,
  messageId: string,
): Promise<MessageDetailsQueryData> => {
  const details = await getMessageDetails(reportId, messageId);
  if (!details) {
    throw new Response('', {
      status: 404,
      statusText: 'Message Details Not Found',
    });
  }
  return details;
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
