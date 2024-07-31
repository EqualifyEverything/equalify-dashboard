import { get } from 'aws-amplify/api';

interface ApiResponse {
    apikey: string;
}
const API_NAME = 'auth';

/**
 * Fetch API key
 * @returns {Promise<ApiResponse>} API key
 * @throws Will throw an error if the fetch fails
 */
export const getApikey = async (): Promise<ApiResponse> => {
    try {
        const response = await get({
            apiName: API_NAME,
            path: '/get/apikey',
        }).response;

        const { body } = response;
        const { apikey } = (await body.json()) as unknown as ApiResponse;
        return { apikey };
    } catch (error) {
        console.error('Error fetching API Key', error);
        throw error;
    }
};
