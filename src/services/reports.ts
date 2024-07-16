import { del, get, post, put } from 'aws-amplify/api';

interface ApiResponse<T> {
  status: string;
  result: T;
  total?: number;
}

interface Report {
  id: string;
  name: string;
  activeIssues: number;
  mostCommonIssue: string;
}

const API_NAME = 'auth';

/**
 * Fetch all reports
 * @returns {Promise<Report[]>} List of reports
 * @throws Will throw an error if the fetch fails
 */
export const getReports = async (): Promise<Report[]> => {
  try {
    const response = await get({
      apiName: API_NAME,
      path: '/get/reports',
    }).response;

    const { body } = response;
    const { result } = (await body.json()) as unknown as ApiResponse<Report[]>;
    return result;
  } catch (error) {
    console.error('Error fetching reports', error);
    throw error;
  }
};

/**
 * Fetch report by ID
 * @param {string} reportId - The ID of the report to fetch
 * @returns {Promise<Report>} The fetched report
 * @throws Will throw an error if the fetch fails
 */
export const getReportById = async (reportId: string): Promise<Report> => {
  try {
    const response = await get({
      apiName: API_NAME,
      path: '/get/reports',
      options: {
        queryParams: { reportId },
      },
    }).response;

    const { body } = response;
    const { result } = (await body.json()) as unknown as ApiResponse<Report[]>;
    return result[0];
  } catch (error) {
    console.error('Error fetching report by ID', error);
    throw error;
  }
};
/**
 * Fetch report details
 * @param {string} reportId - The ID of the report to fetch details for
 * @param {Record<string, string>} params - Additional parameters for filtering the details
 * @returns {Promise<any>} The fetched report details
 * @throws Will throw an error if the fetch fails
 */
export const getReportDetails = async (reportId: string, params: Record<string, string> = {}): Promise<any> => {
  try {
    const response = await get({
      apiName: API_NAME,
      path: `/get/results`,
      options: {
        queryParams: { reportId, ...params },
      },
    }).response;

    const { body } = response;
    const details = await body.json();
    return details;
  } catch (error) {
    console.error('Error fetching report details', error);
    throw error;
  }
};

/**
 * Add a new report
 * @param {string} reportName - The name of the report
 * @param {any[]} filters - The filters for the report
 * @returns {Promise<{ result: Report; status: string }>} The added report and status
 * @throws Will throw an error if the addition fails
 */
export const addReport = async (
  reportName: string,
  filters: any[],
): Promise<{ result: Report; status: string }> => {
  try {
    const response = await post({
      apiName: API_NAME,
      path: '/add/reports',
      options: {
        body: { reportName, filters },
      },
    }).response;

    const { body, statusCode } = response;
    const { result } = (await body.json()) as unknown as ApiResponse<Report>;
    return { result, status: statusCode === 200 ? 'success' : 'error' };
  } catch (error) {
    console.error('Error adding report', error);
    throw error;
  }
};

/**
 * Update a report
 * @param {string} reportId - The ID of the report to update
 * @param {string} reportName - The new name of the report
 * @param {any[]} filters - The new filters for the report
 * @returns {Promise<{ result: Report; status: string }>} The updated report and status
 * @throws Will throw an error if the update fails
 */
export const updateReport = async (
  reportId: string,
  reportName?: string,
  filters?: any[],
): Promise<{ result: Report; status: string }> => {
  try {
    const updateBody: any = { reportId };
    if (reportName) updateBody.reportName = reportName;
    if (filters) updateBody.filters = filters;

    const response = await put({
      apiName: API_NAME,
      path: '/update/reports',
      options: {
        body: updateBody,
      },
    }).response;

    const { body, statusCode } = response;
    const { result } = (await body.json()) as unknown as ApiResponse<Report>;
    return { result, status: statusCode === 200 ? 'success' : 'error' };
  } catch (error) {
    console.error('Error updating report', error);
    throw error;
  }
};

/**
 * Delete a report
 * @param {string} reportId - The ID of the report to delete
 * @returns {Promise<{ status: string }>} The status of the deletion
 * @throws Will throw an error if the deletion fails
 */
export const deleteReport = async (
  reportId: string,
): Promise<{ status: string }> => {
  try {
    const response = await del({
      apiName: API_NAME,
      path: '/delete/reports',
      options: {
        queryParams: { reportId },
      },
    }).response;

    const { statusCode } = response;
    return { status: statusCode === 200 ? 'success' : 'error' };
  } catch (error) {
    console.error('Error deleting report', error);
    throw error;
  }
};
