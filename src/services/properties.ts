import { del, get, post, put } from 'aws-amplify/api';

interface ApiResponse<T> {
  status: string;
  result: T;
  total?: number;
}

type Node = {
  url: string;
};

type Nodes = {
  nodes: Node[];
};

interface Property {
  id: string;
  name: string;
  propertyUrl: string;
  lastProcessed: string;
  archived: boolean;
  discovery: null | 'single' | 'sitemap' | 'discovery_process';
  processed: null | string;
  updatedAt: string;
  createdAt: string;
}

const API_NAME = 'auth';

/**
 * Fetch all properties
 * @returns {Promise<Property[]>} List of properties
 * @throws Will throw an error if the fetch fails
 */
export const getProperties = async (): Promise<Property[]> => {
  try {
    const response = await get({
      apiName: API_NAME,
      path: '/get/properties',
    }).response;

    const { body } = response;
    const { result } = (await body.json()) as unknown as ApiResponse<
      Property[]
    >;
    return result;
  } catch (error) {
    console.error('Error fetching properties', error);
    throw error;
  }
};

/**
 * Fetch property by ID
 * @param {string} propertyId - The ID of the property to fetch
 * @returns {Promise<Property>} The fetched property
 * @throws Will throw an error if the fetch fails
 */
export const getPropertyById = async (
  propertyId: string,
): Promise<Property> => {
  try {
    const response = await get({
      apiName: API_NAME,
      path: `/get/properties`,
      options: {
        queryParams: { propertyIds: propertyId },
      },
    }).response;

    const { body } = response;
    const { result } = (await body.json()) as unknown as ApiResponse<
      Property[]
    >;
    return result[0];
  } catch (error) {
    console.error('Error fetching property by ID', error);
    throw error;
  }
};

/**
 * Add a new property
 * @param {string} propertyName - The name of the property
 * @param {string} propertyUrl - The URL of the property
 * @param {'single' | 'sitemap' |'discovery_process'} propertyDiscovery - The discovery method of the property
 * @returns {Promise<{ result: Property; status: string }>} The added property and status
 * @throws Will throw an error if the addition fails
 */
export const addProperty = async (
  propertyName: string,
  propertyUrl: string,
  propertyDiscovery: 'single' | 'sitemap' | 'discovery_process',
): Promise<{ result: Property; status: string }> => {
  try {
    const response = await post({
      apiName: API_NAME,
      path: '/add/properties',
      options: {
        body: {
          propertyName,
          propertyUrl,
          propertyDiscovery,
        },
      },
    }).response;

    const { body, statusCode } = response;
    const { result } = (await body.json()) as unknown as ApiResponse<Property>;
    return { result, status: statusCode === 200 ? 'success' : 'error' };
  } catch (error) {
    console.error('Error adding property', error);
    throw error;
  }
};

/**
 * Update a property
 * @param {string} propertyId - The ID of the property to update
 * @param {string} propertyName - The new name of the property
 * @param {string} propertyUrl - The new URL of the property
 * @param {string} propertyDiscovery - The discovery of the property
 * @returns {Promise<{ result: Property; status: string }>} The updated property and status
 * @throws Will throw an error if the update fails
 */
export const updateProperty = async (
  propertyId: string,
  propertyName: string,
  propertyUrl: string,
  propertyDiscovery: string,
): Promise<{ result: Property; status: string }> => {
  try {
    const response = await put({
      apiName: API_NAME,
      path: '/update/properties',
      options: {
        body: {
          propertyId,
          propertyName,
          propertyUrl,
          propertyDiscovery,
        },
      },
    }).response;

    const { body, statusCode } = response;
    const { result } = (await body.json()) as unknown as ApiResponse<Property>;
    return { result, status: statusCode === 200 ? 'success' : 'error' };
  } catch (error) {
    console.error('Error updating property', error);
    throw error;
  }
};

/**
 * Delete a property
 * @param {string} propertyId - The ID of the property to delete
 * @returns {Promise<{ status: string }>} The status of the deletion
 * @throws Will throw an error if the deletion fails
 */
export const deleteProperty = async (
  propertyId: string,
): Promise<{ status: string }> => {
  try {
    const response = await del({
      apiName: API_NAME,
      path: '/delete/properties',
      options: {
        queryParams: {
          propertyId,
        },
      },
    }).response;

    const { statusCode } = response;
    return { status: statusCode === 200 ? 'success' : 'error' };
  } catch (error) {
    console.error('Error deleting property', error);
    throw error;
  }
};
