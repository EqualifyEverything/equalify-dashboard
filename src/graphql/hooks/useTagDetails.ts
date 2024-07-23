import { useQuery } from '@tanstack/react-query';
import { Message } from '../types';
import { getTagDetails } from '~/services';

interface TagDetailsQueryData {
  messages: Message[];
  reportName: string;
  tagName: string;
}

const fetchTagDetails = async (
  reportId: string,
  tagId: string,
): Promise<TagDetailsQueryData> => {
  const details = await getTagDetails(reportId, tagId);
  if (!details) {
    throw new Response('', {
      status: 404,
      statusText: 'Message Details Not Found',
    });
  }
  return details;
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
