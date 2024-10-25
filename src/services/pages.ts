import { get } from 'aws-amplify/api';

interface ApiResponse<T> {
  status: string;
  result: T;
  total: number;
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

export interface IPages {
  pages: IPage[];
  total: number;
}

const API_NAME = 'auth';

/**
 * Fetch all pages
 * @returns {Promise<IPages>} List of pages
 * @throws Will throw an error if the fetch fails
 */
export const getPages = async ({ params }: { params: IPageParams }): Promise<IPages> => {
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
    const { result, total } = (await body.json()) as unknown as ApiResponse<
    IPage[]
    >;
    return { pages: result, total };
  } catch (error) {
    console.error('Error fetching pages', error);
    throw error;
  }
};
