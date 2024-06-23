import { queryOptions } from '@tanstack/react-query';
import { getReports, getReportById, getReportDetails } from '~/services';

// Query for all reports
export const reportsQuery = () =>
  queryOptions({
    queryKey: ['reports'],
    queryFn: getReports,
  });

// Query for a specific report
export const reportQuery = (propertyId: string) =>
  queryOptions({
    queryKey: ['report', propertyId],
    queryFn: async () => {
        const report = await getReportById(propertyId);
        if (!report) {
          throw new Response('', {
            status: 404,
            statusText: 'Report Not Found',
          });
        }
        return report;
      },
  });

  // Query for report details
export const reportDetailsQuery = (reportId: string) =>
  queryOptions({
    queryKey: ['reportDetails', reportId],
    queryFn: async () => {
      const details = await getReportDetails(reportId);
      if (!details) {
        throw new Response('', {
          status: 404,
          statusText: 'Report Details Not Found',
        });
      }
      return details;
    },
  });