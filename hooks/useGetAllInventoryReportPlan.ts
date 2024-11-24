import { getAllInventoryReportPlan } from '@/api/inventoryReportPlan';
import { ApiResponse } from '@/types/ApiResponse';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useGetAllInventoryReportPlan = () => {
  const { data, error, isPending, isError, isSuccess, refetch } = useQuery<
    ApiResponse,
    AxiosError
  >({
    queryKey: ['inventoryReportPlan'],
    queryFn: getAllInventoryReportPlan,
  });

  return { data, error, isPending, isError, isSuccess, refetch };
};
