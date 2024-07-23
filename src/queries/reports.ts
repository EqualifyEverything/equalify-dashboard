import { queryOptions } from '@tanstack/react-query';
import { getReports, getReportById, getReportDetails, getPageDetails, getMessageDetails, getTagDetails } from '~/services';

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
// Query for page details
export const pageDetailsQuery = (reportId: string, urlId: string) =>
  queryOptions({
    queryKey: ['pageDetails', reportId, urlId],
    queryFn: async () => {
      const details = await getPageDetails(reportId, urlId);
      if (!details) {
        throw new Response('', {
          status: 404,
          statusText: 'Page Details Not Found',
        });
      }
      return details;
    },
  });

// Query for message details
export const messageDetailsQuery = (reportId: string, messageId: string) =>
  queryOptions({
    queryKey: ['messageDetails', reportId, messageId],
    queryFn: async () => {
      const details = await getMessageDetails(reportId, messageId);
      if (!details) {
        throw new Response('', {
          status: 404,
          statusText: 'Message Details Not Found',
        });
      }
      return details;
    },
  });

// Query for tag details
export const tagDetailsQuery = (reportId: string, tagId: string) =>
  queryOptions({
    queryKey: ['tagDetails', reportId, tagId],
    queryFn: async () => {
      const details = await getTagDetails(reportId, tagId);
      if (!details) {
        throw new Response('', {
          status: 404,
          statusText: 'Tag Details Not Found',
        });
      }
      return details;
    },
  });