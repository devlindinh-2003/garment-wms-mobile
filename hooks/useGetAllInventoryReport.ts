import { getAllInventoryReport } from '@/api/inventoryReport';
import { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { InventoryReportListResponse } from '@/types/InventoryReportListResponse';

interface UseGetAllInventoryReportParams {
  sorting?: { id: string; desc: boolean }[];
  filters?: { id: string; value: any }[];
  pageSize?: number;
  pageIndex?: number;
}

export const useGetAllInventoryReport = ({
  sorting = [],
  filters = [],
  pageSize = 10,
  pageIndex = 0,
}: UseGetAllInventoryReportParams) => {
  const {
    data,
    status,
    isLoading: isPending,
    isError,
    isSuccess,
    isFetching,
  } = useQuery<InventoryReportListResponse, AxiosError>({
    queryKey: ['importRequestList', sorting, filters, pageIndex, pageSize],
    queryFn: () =>
      getAllInventoryReport({ sorting, filters, pageSize, pageIndex }),
  });

  const importRequestList = data?.data;
  const pageMeta = data?.pageMeta;

  return {
    data,
    status,
    isPending,
    isFetching,
    isError,
    isSuccess,
    pageMeta,
    importRequestList,
  };
};
