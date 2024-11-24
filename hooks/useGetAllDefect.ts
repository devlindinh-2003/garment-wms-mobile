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
  return { data, error, isPending, isError, isSuccess, refetch };
};
