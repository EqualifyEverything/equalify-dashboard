import { get } from 'aws-amplify/api';

interface ApiResponse<T> {
  status: string;
  result: T;
}

export interface IPage {
  id: string;
  url: string;
  property: {
    id: string;
    name: string;
  }  
  scans: [{
    "updated_at":string;
    processing: boolean;
  }]
}

export interface IPageParams {
  offset: number;
  limit: number;
}

const API_NAME = 'auth';

/**
 * Fetch all pages
 * @returns {Promise<IPage[]>} List of pages
 * @throws Will throw an error if the fetch fails
 */
export const getPages = async ({ params }: { params: IPageParams }): Promise<IPage[]> => {
  try {
    const response = await get({
      apiName: API_NAME,
      path: '/get/pages',
      options: {
        queryParams: {
          offset: params.offset.toString(),
          limit: params.limit.toString()
        }
      }
    }).response;

    const { body } = response;
    const { result } = (await body.json()) as unknown as ApiResponse<
    IPage[]
    >;
    return result;
  } catch (error) {
    console.error('Error fetching pages', error);
    throw error;
  }
};
