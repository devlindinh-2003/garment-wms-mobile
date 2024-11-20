import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { InspectionRequestListResponse } from '../types/InspectionRequestResponse';
import { getAllnspectionRequest } from '@/api/inspectionRequest';

interface UseGetAllInspectionRequestParams {
  sorting?: { id: string; desc: boolean }[];
  filters?: { id: string; value: any }[];
  pageSize?: number;
  pageIndex?: number;
}

export const useGetAllInspectionRequest = ({
  sorting = [],
  filters = [],
  pageSize = 10,
  pageIndex = 0,
}: UseGetAllInspectionRequestParams) => {
  const {
    data,
    status,
    isLoading: isPending,
    isError,
    isSuccess,
    isFetching,
  } = useQuery<InspectionRequestListResponse, AxiosError>({
    queryKey: ['inspectionRequestList', sorting, filters, pageIndex, pageSize],
    queryFn: () =>
      getAllnspectionRequest({ sorting, filters, pageSize, pageIndex }),
  });

  const inspectionRequestList = data?.data;
  const pageMeta = data?.pageMeta;

  return {
    data,
    status,
    isPending,
    isFetching,
    isError,
    isSuccess,
    pageMeta,
    inspectionRequestList,
  };
};
