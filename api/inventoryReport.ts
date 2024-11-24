import { InventoryReportListResponse } from '@/types/InventoryReportListResponse';
import {
  FilterBuilder,
  FilterOperationType,
} from '@chax-at/prisma-filter-common';
import { get } from './ApiCaller';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GetAllInventoryReportInput {
  sorting?: { id: string; desc: boolean }[];
  filters?: { id: string; value: any }[];
  pageSize?: number;
  pageIndex?: number;
}

interface GetAllInventoryReport {
  sorting?: { id: string; desc: boolean }[];
  filters?: { id: string; value: any }[];
  pageSize?: number;
  pageIndex?: number;
}

export const getAllInventoryReport = async ({
  sorting = [],
  filters = [],
  pageSize = 10,
  pageIndex = 0,
}: GetAllInventoryReportInput): Promise<InventoryReportListResponse> => {
  const limit = pageSize;
  const offset = pageIndex * pageSize;

  // Initialize filter and order arrays
  const filter: any[] = [];
  const order: any[] = [];

  // Build filter array from filters
  filters.forEach(({ id, value }) => {
    let type: FilterOperationType;

    if (Array.isArray(value)) {
      type = FilterOperationType.InStrings;
    } else if (value === null) {
      type = FilterOperationType.NeNull;
    } else {
      type = FilterOperationType.Eq;
    }

    filter.push({ field: id, type, value });
  });

  // Build order array from sorting
  sorting.forEach(({ id, desc }) => {
    const direction = desc ? 'desc' : 'asc';
    order.push({ field: id, dir: direction });
  });

  // Construct query string
  const queryString = FilterBuilder.buildFilterQueryString({
    limit,
    offset,
    filter,
    order,
  });

  const fullUrl = `/import-request${queryString}`;

  try {
    const config = get(fullUrl);
    const response = await axios(config);
    return response.data.data as InventoryReportListResponse;
  } catch (error) {
    console.error('Error fetching import requests:', error);
    throw new Error('Failed to fetch import requests');
  }
};

export const getWarehouseStaffInventoryReport = async ({
  sorting = [],
  filters = [],
  pageSize = 5,
  pageIndex = 0,
}: GetAllInventoryReport): Promise<InventoryReportListResponse> => {
  const limit = pageSize;
  const offset = pageIndex * pageSize;
  // Construct query string
  const queryString = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  }).toString();
  const fullUrl = `https://garment-wms-be-1.onrender.com/inventory-report/warehouse-staff?${queryString}`;
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
    }); // Log response data for debugging
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    return response.data as InventoryReportListResponse;
  } catch (error: any) {
    console.error(
      'Failed to fetch inventory report plans for warehouse staff:',
      error.response?.data || error.message
    );
    throw new Error('Failed to fetch inventory report plans.');
  }
};
