import axios from 'axios';
import { get } from './ApiCaller';
import { ApiResponse } from '@/types/ApiResponse';

export const getAllInventoryReportPlan = async (): Promise<ApiResponse> => {
  try {
    const config = get('/inventory-report-plan');
    const response = await axios(config);
    return response.data as ApiResponse;
  } catch (error: any) {
    console.error('Failed to fetch all inventory report plans:', error);
    if (axios.isAxiosError(error) && error.response) {
      return {
        statusCode: error.response.status,
        data: null,
        message:
          error.response.data.message ||
          'An error occurred while fetching inventory report plans.',
        errors: error.response.data.errors || null,
      } as ApiResponse;
    }
    throw new Error(
      'An unexpected error occurred while fetching inventory report plans.'
    );
  }
};
