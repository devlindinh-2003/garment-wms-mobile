import { getInspectionReportById } from '@/api/inspectionReport';
import { ApiResponse } from '@/types/ApiResponse';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useGetInspectionReportById = (id: string) => {
  const { data, error, isPending, isError, isSuccess, refetch } = useQuery<
    ApiResponse,
    AxiosError
  >({
    queryKey: ['inspectionRequest', id],
    queryFn: () => getInspectionReportById(id),
    enabled: !!id,
  });

  return { data, error, isPending, isError, isSuccess, refetch };
};
