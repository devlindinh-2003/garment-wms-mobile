import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { getInspectionRequestById } from '@/api/inspectionRequest';

export const useGetInspectionRequestById = (id: string) => {
  const { data, error, isPending, isError, isSuccess, refetch } = useQuery<
    ApiResponse,
    AxiosError
  >({
    queryKey: ['inspectionRequest', id],
    queryFn: () => getInspectionRequestById(id),
    enabled: !!id,
  });

  return { data, error, isPending, isError, isSuccess, refetch };
};
