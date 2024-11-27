import axios from 'axios';
import { get } from './ApiCaller';
import { ApiResponse } from '@/types/ApiResponse';
import {
  FilterBuilder,
  FilterOperationType,
} from '@chax-at/prisma-filter-common';
import { InventoryReportPlanListResponse } from '@/types/InventoryReportPlanListResponse';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
