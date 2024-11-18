import { InspectionReportListResponse } from '@/types/InspectionReportResponse';
import {
  FilterBuilder,
  FilterOperationType,
} from '@chax-at/prisma-filter-common';
import { get, post } from './ApiCaller';
import axios from 'axios';
import { InspectionReportDetail } from '@/types/InspectionReportDetail';
import { ApiResponse } from '@/types/ApiResponse';

interface GetAllInspectionReportInput {
  sorting?: { id: string; desc: boolean }[];
  filters?: { id: string; value: any }[];
  pageSize?: number;
  pageIndex?: number;
}

export interface CreateInspectionReportParams {
  inspectionRequestId: string;
  inspectionDepartmentId: string;
  inspectionReportDetail: InspectionReportDetail[];
}

export const getAllInspectionReport = async ({
  sorting = [],
  filters = [],
  pageSize = 10,
  pageIndex = 0,
}: GetAllInspectionReportInput): Promise<InspectionReportListResponse> => {
  const limit = pageSize;
  const offset = pageIndex * pageSize;

  const filter: any[] = [];
  const order: any[] = [];

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

  sorting.forEach(({ id, desc }) => {
    const direction = desc ? 'desc' : 'asc';
    order.push({ field: id, dir: direction });
  });

  const queryString = FilterBuilder.buildFilterQueryString({
    limit,
    offset,
    filter,
    order,
  });

  const fullUrl = `/inspection-request${queryString}`;

  try {
    const config = get(fullUrl);
    const response = await axios(config);
    return response.data.data as InspectionReportListResponse;
  } catch (error) {
    console.error('Error fetching import requests:', error);
    throw new Error('Failed to fetch import requests');
  }
};

export const createInspectionReport = async (
  data: CreateInspectionReportParams
): Promise<ApiResponse> => {
  const endpoint = '/inspection-report';
  const config = post(endpoint, data);
  try {
    const response = await axios(config);
    return response.data as ApiResponse;
  } catch (error: any) {
    console.error('Failed to create inspection report:', error);

    if (axios.isAxiosError(error) && error.response) {
      return {
        statusCode: error.response.status,
        data: null,
        message:
          error.response.data.message ||
          'An error occurred while creating the inspection report.',
        errors: error.response.data.errors || null,
      } as ApiResponse;
    }

    throw new Error(
      'An unexpected error occurred while creating the inspection report.'
    );
  }
};
