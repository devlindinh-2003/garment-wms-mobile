import { getAllDefects } from '@/api/defect';
import { ApiResponse } from '@/types/ApiResponse';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useGetAllDefect = () => {
  const { data, error, isPending, isError, isSuccess, refetch } = useQuery<
    ApiResponse,
    AxiosError
  >({
    queryKey: ['inspectionRequest'],
    queryFn: () => getAllDefects(),
  });
  const defectsList = data?.data || [];
  return { data, error, isPending, isError, isSuccess, refetch, defectsList };
};
