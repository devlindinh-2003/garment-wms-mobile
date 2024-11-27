import { getInventoryReportById } from '@/api/inventoryReport';
import { ApiResponse } from '@/types/ApiResponse';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useGetInventoryReporttById = (id: string) => {
  const { data, error, isPending, isError, isSuccess, refetch } = useQuery<
    ApiResponse,
    AxiosError
  >({
    queryKey: ['inspectionRequest', id],
    queryFn: () => getInventoryReportById(id),
    enabled: !!id,
  });

  return { data, error, isPending, isError, isSuccess, refetch };
};
