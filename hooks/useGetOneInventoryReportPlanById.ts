import { useQuery } from '@tanstack/react-query';
import { ApiResponse } from '@/types/ApiResponse';
import { AxiosError } from 'axios';
import { getOneInventoryReportPlan } from '@/api/inventoryReportPlan';

export const useGetOneInventoryReportPlanById = (id: string) => {
  const { data, error, isPending, isError, isSuccess, refetch } = useQuery<
    ApiResponse,
    AxiosError
  >({
    queryKey: ['inventoryReportPlan', id],
    queryFn: () => getOneInventoryReportPlan(id),
    enabled: !!id,
  });

  return { data, error, isPending, isError, isSuccess, refetch };
};
