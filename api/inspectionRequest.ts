import axios from 'axios';
import { get, post } from './ApiCaller';
import {
  FilterBuilder,
  FilterOperationType,
} from '@chax-at/prisma-filter-common';
import { InspectionRequestListResponse } from '@/types/InspectionRequestResponse';
import { ApiResponse } from '@/types/ApiResponse';
import { InspectionRequestType } from '@/enums/inspectionRequestType';

interface InspectionReportDetail {
  approvedQuantityByPack: number;
  defectQuantityByPack: number;
  materialVariantId: string;
}

export interface CreateInspectionReportParams {
  inspectionRequestId: string;
  inspectionDepartmentId: string;
  inspectionReportDetail: InspectionReportDetail[];
}

interface GetAllInspectionRequestInput {
  sorting?: { id: string; desc: boolean }[];
  filters?: { id: string; value: any }[];
  pageSize?: number;
  pageIndex?: number;
}

export const getAllnspectionRequest = async ({
  sorting = [],
  filters = [],
  pageSize = 10,
  pageIndex = 0,
}: GetAllInspectionRequestInput): Promise<InspectionRequestListResponse> => {
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
    return response.data.data as InspectionRequestListResponse;
  } catch (error) {
    console.error('Error fetching import requests:', error);
    throw new Error('Failed to fetch import requests');
  }
};

export const getInspectionStatisticByType = async (
  type: InspectionRequestType
): Promise<ApiResponse> => {
  try {
    const config = get(`/inspection-request/statistic`, { type });
    const response = await axios(config);
    return response.data as ApiResponse;
  } catch (error: any) {
    console.error('Failed to fetch inspection statistics:', error);

    if (axios.isAxiosError(error) && error.response) {
      return {
        statusCode: error.response.status,
        data: null,
        message:
          error.response.data.message ||
          'An error occurred while fetching statistics.',
        errors: error.response.data.errors || null,
      } as ApiResponse;
    }

    throw new Error('An unexpected error occurred while fetching statistics.');
  }
};

export const getInspectionRequestById = async (
  id: string
): Promise<ApiResponse> => {
  try {
    const config = get(`/inspection-request/${id}`);
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
          'An error occurred while fetching the import request.',
        errors: error.response.data.errors || null,
      } as ApiResponse;
    }

    throw new Error(
      'An unexpected error occurred while fetching the import request.'
    );
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
