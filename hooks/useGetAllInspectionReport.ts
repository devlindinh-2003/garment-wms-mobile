import { getAllInspectionReport } from '@/api/inspectionReport';
import { InspectionReportListResponse } from '@/types/InspectionReportResponse';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface UseGetAllInspectionReportParams {
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
}: UseGetAllInspectionReportParams) => {
  const {
    data,
    status,
    isLoading: isPending,
    isError,
    isSuccess,
    isFetching,
  } = useQuery<InspectionReportListResponse, AxiosError>({
    queryKey: ['inspectionRequestList', sorting, filters, pageIndex, pageSize],
    queryFn: () =>
      getAllInspectionReport({ sorting, filters, pageSize, pageIndex }),
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
