import { get, post } from 'aws-amplify/api';

interface ApiResponse<T> {
  status: string;
  result: T;
  total?: number;
}
interface ApiResponseSingle<Scan> {
  status: string;
  result: Scan;
}

interface Scan {
  jobId: string;
  url: {
    id: string;
    url: string;
  };
  property: {
    id: string;
    name: string;
  };
}

const API_NAME = 'auth';

/**
 * Fetch all scans
 * @returns {Promise<Scan[]>} List of scans
 * @throws Will throw an error if the fetch fails
 */
export const getScans = async (): Promise<Scan[]> => {
  try {
    const response = await get({
      apiName: API_NAME,
      path: '/get/scans',
    }).response;

    const { body } = response;
    const { result } = (await body.json()) as unknown as ApiResponse<Scan[]>;
    return result;
  } catch (error) {
    console.error('Error fetching scans', error);
    throw error;
  }
};

/**
 * Fetch single scan
 * @returns {Promise<Scan>} Single scan
 * @throws Will throw an error if the fetch fails
 */
export const getScan = async (scanId: string): Promise<Scan> => {
  try {
    const response = await get({
      apiName: API_NAME,
      path: '/get/scan',
      options: {
        queryParams: {
          scanId,
        },
      },
    }).response;

    const { body } = response;
    const { result } = (await body.json()) as unknown as ApiResponseSingle<Scan>;
    return result;
  } catch (error) {
    console.error('Error fetching scans', error);
    throw error;
  }
};

/**
 * Send property to scan
 * @param {string[]} propertyIds - The IDs of the properties to scan
 * @returns {Promise<{ status: string }>} The status of the scan initiation
 * @throws Will throw an error if the scan initiation fails
 */
export const sendToScan = async (
  propertyIds: string[],
): Promise<{ status: string }> => {
  try {
    const response = await post({
      apiName: API_NAME,
      path: '/add/scans',
      options: {
        body: { propertyIds },
      },
    }).response;

    const { statusCode, body } = response;
    const parsedBody = await body.json();
    return { status: statusCode === 200 ? parsedBody?.status ?? 'success' : 'error' };
  } catch (error) {
    console.error('Error sending to scan', error);
    throw error;
  }
};


/**
 * Send url to scan
 * @param {string} urlId - The url ID to scan
 * @returns {Promise<{ status: string }>} The status of the scan initiation
 * @throws Will throw an error if the scan initiation fails
 */
export const sendUrlToScan = async (
  urlId: string,
): Promise<{ status: string }> => {
  try {
    const response = await post({
      apiName: API_NAME,
      path: '/add/scans',
      options: {
        body: { urlIds: [urlId] },
      },
    }).response;

    const { statusCode } = response;
    return { status: statusCode === 200 ? 'success' : 'error' };
  } catch (error) {
    console.error('Error sending to scan', error);
    throw error;
  }
};