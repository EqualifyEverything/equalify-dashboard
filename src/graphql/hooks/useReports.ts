import { useQuery } from '@tanstack/react-query';

import { mockReports } from '../mocks/mock-reports';

interface Report {
  id: string;
  name: string;
  activeIssues: number;
  mostCommonIssue: string;
}

const fetchReports = async (): Promise<Report[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockReports;
};

export const useReports = () =>
  useQuery<Report[]>({
    queryKey: ['reports'],
    queryFn: fetchReports,
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });
