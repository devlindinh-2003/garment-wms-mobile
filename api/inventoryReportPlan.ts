import axios from 'axios';
import { get } from './ApiCaller';
import { ApiResponse } from '@/types/ApiResponse';
import {
  FilterBuilder,
  FilterOperationType,
} from '@chax-at/prisma-filter-common';
import { InventoryReportPlanListResponse } from '@/types/InventoryReportPlanListResponse';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GetAllInventoryPlan {
  sorting?: { id: string; desc: boolean }[];
  filters?: { id: string; value: any }[];
  pageSize?: number;
  pageIndex?: number;
}

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

export const getOneInventoryReportPlan = async (
  id: string
): Promise<ApiResponse> => {
  try {
    const config = get(`/inventory-report-plan/${id}`);
    const response = await axios(config);
    return response.data as ApiResponse;
  } catch (error: any) {
    console.error(
      `Failed to fetch inventory report plan with ID ${id}:`,
      error
    );
    if (axios.isAxiosError(error) && error.response) {
      return {
        statusCode: error.response.status,
        data: null,
        message:
          error.response.data.message ||
          'An error occurred while fetching the inventory report plan.',
        errors: error.response.data.errors || null,
      } as ApiResponse;
    }
    throw new Error(
      'An unexpected error occurred while fetching the inventory report plan.'
    );
  }
};

export const getWarehouseStaffInventoryReport = async ({
  sorting = [],
  filters = [],
  pageSize = 5,
  pageIndex = 0,
}: GetAllInventoryPlan): Promise<InventoryReportPlanListResponse> => {
  const limit = pageSize;
  const offset = pageIndex * pageSize;

  // Construct query string
  const queryString = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  }).toString();

  const fullUrl = `https://garment-wms-be-1.onrender.com/inventory-report-plan/warehouse-staff?${queryString}`;

  try {
    // Retrieve the access token from AsyncStorage
    const accessToken = await AsyncStorage.getItem('accessToken');

    if (!accessToken) {
      throw new Error('Access token not found. Please log in again.');
    }

    // Configure the API request with axios
    const response = await axios.get(fullUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Log response data for debugging
    console.log('API Response:', JSON.stringify(response.data, null, 2));

    return response.data as InventoryReportPlanListResponse;
  } catch (error: any) {
    // Log detailed error for debugging
    console.error(
      'Failed to fetch inventory report plans for warehouse staff:',
      error.response?.data || error.message
    );
    throw new Error('Failed to fetch inventory report plans.');
  }
};
