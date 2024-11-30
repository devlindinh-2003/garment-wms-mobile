import { getDetailsByReceipt } from '@/api/inventoryReport';
import { ApiResponse } from '@/types/ApiResponse';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useGetDetailByReceipt = (
  code: string,
  type: 'material' | 'product'
) => {
  const { data, error, isPending, isError, isSuccess, refetch } = useQuery<
    ApiResponse,
    AxiosError
  >({
    queryKey: ['detailByReceipt', code, type],
    queryFn: () => getDetailsByReceipt(code, type),
    enabled: !!code && !!type, // Run query only if both code and type are provided
  });

  const itemReceipt = data?.data || {};
  return { data, error, isPending, isError, isSuccess, refetch, itemReceipt };
};
