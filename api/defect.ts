import { ApiResponse } from '@/types/ApiResponse';
import { get } from './ApiCaller';
import axios from 'axios';

export const getAllDefects = async (): Promise<ApiResponse> => {
  try {
    const config = get(`/defect`);
    const response = await axios(config);
    return response.data as ApiResponse;
  } catch (error: any) {
    console.error('Failed to fetch import request by ID:', error);

    if (axios.isAxiosError(error) && error.response) {
      return {
        statusCode: error.response.status,
        data: null,
        message:
          error.response.data.message ||
          'An error occurred while fetching the import report.',
        errors: error.response.data.errors || null,
      } as ApiResponse;
    }

    throw new Error(
      'An unexpected error occurred while fetching the import request.'
    );
  }
};
