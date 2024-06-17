import { useQuery } from '@tanstack/react-query';
import * as API from "aws-amplify/api";

interface Report {
  id: string;
  name: string;
  activeIssues: number;
  mostCommonIssue: string;
}

const fetchReports = async (): Promise<Report[]> => {
  const reports = await (await API.get({ apiName: 'auth', path: '/get/reports' }).response).body.json();
  return reports.result;
};

export const useReports = () =>
  useQuery<Report[]>({
    queryKey: ['reports'],
    queryFn: fetchReports,
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });
