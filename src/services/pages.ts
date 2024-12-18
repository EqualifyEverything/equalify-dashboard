import { post, get, patch, put } from 'aws-amplify/api';
import { stringify } from 'postcss';

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
  scans: IPageScan[]
}

export interface IPageDetails extends IPage {
  "created_at"  : string;
  "updated_at"  : string;
}

export interface IPageScan {
    id: string;
    "updated_at":string;
    processing: boolean;
  
}

export interface IPageParams {
  offset: number;
  limit: number;
}

export interface IPages {
  pages: IPage[];
  total: number;
}

export interface IUrl {
  url: string;
  urlId: string;
}

export interface IPageDetailParams {
  pageId: string;
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

/**
 * Fetch single page detail
 * @returns {Promise<IPageDetails>} Single IPage record
 * @throws Will throw an error if the fetch fails
 */
export const getPageDetail = async ( params :IPageDetailParams): Promise<IPageDetails> => {
  try {
    const response = await get({
      apiName: API_NAME,
      path: `/get/page`,
      options: {
        queryParams: {
          pageId: params.pageId,
        },
      },
    }).response;
    const { body } = response;
    const { result } = (await body.json()) as unknown as ApiResponse<
    IPageDetails
    >;
    return result ;
  } catch (error) {
    console.error('Error fetching pages', error);
    throw error;
  }
};

/**
 * Send pages to scan
 * @param urls - Array of <IUrl>s to sent to scan
 * @throws Will throw an error if the send fails
 */
export const sendUrlsToScan = async (
  urls:any
): Promise<{ result: any; status: string }> => {
  try {
    const response = await post({
      apiName: API_NAME,
      path: '/add/scansByPage',
      options: {
        body:  urls
      },
    }).response;

    const { body, statusCode } = response;
    const result = await body.json();
    return { result, status: statusCode === 200 ? 'success' : 'error' };
  } catch (error) {
    throw error;
  }
};

/**
 * Update the property for an array of pages
 * @throws Will throw an error if the send fails
 */
export const updateUrlsProperty = async (
  params:any
): Promise<{ result: any; status: string }> => {
  try {
    const response = await put({
      apiName: API_NAME,
      path: '/update/pages/property',
      options: {
        body:  params
      },
    }).response;

    const { body, statusCode } = response;
    const result = await body.json();
    return { result, status: statusCode === 200 ? 'success' : 'error' };
  } catch (error) {
    throw error;
  }
};

/* Add pages */
export const addPagesFromForm = async (
  formData:any
): Promise<{result:any}> => {
  console.log(JSON.stringify(formData))
  try {
    const response = await post({
      apiName: API_NAME,
      path: '/add/pages',
      options: {
        body: formData
      },
    }).response;

    const { body, statusCode } = response;
    const result = await body.json();
    return { result };
  } catch (error) {
    console.log("Server error adding pages!");
    throw error;
  }
};
