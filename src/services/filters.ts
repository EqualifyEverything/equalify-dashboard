import { get } from 'aws-amplify/api';

interface ApiResponse<T> {
  status: string;
  result: T;
  total?: number;
}

export interface FilterOption {
  value: string;
  label: string;
  type: string;
}

export interface FiltersResponse {
  messages: FilterOption[];
  tags: FilterOption[];
  properties: FilterOption[];
  urls: FilterOption[];
  statuses: FilterOption[];
}

const API_NAME = 'auth';

/**
 * Fetch filters for reports
 * @returns {Promise<FiltersResponse>} Filters for reports
 * @throws Will throw an error if the fetch fails
 */
export const getFilters = async (): Promise<FiltersResponse> => {
  try {
    const response = await get({
      apiName: API_NAME,
      path: '/get/filters',
    }).response;

    const { body } = response;
    const { result } = (await body.json()) as unknown as ApiResponse<FiltersResponse>;
    return result;
  } catch (error) {
    console.error('Error fetching filters', error);
    throw error;
  }
};
