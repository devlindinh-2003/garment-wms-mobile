import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getAllImportRequest } from '../api/importRequest';
import { ImportRequestListResponse } from '../types/ImportRequestResponse';

interface UseGetAllImportRequestParams {
  sorting?: { id: string; desc: boolean }[];
  filters?: { id: string; value: any }[];
  pageSize?: number;
  pageIndex?: number;
}

export const useGetAllImportRequest = ({
  sorting = [],
  filters = [],
  pageSize = 10,
  pageIndex = 0,
}: UseGetAllImportRequestParams) => {
  const {
    data,
    status,
    isLoading: isPending,
    isError,
    isSuccess,
    isFetching,
  } = useQuery<ImportRequestListResponse, AxiosError>({
    queryKey: ['importRequestList', sorting, filters, pageIndex, pageSize],
    queryFn: () =>
      getAllImportRequest({ sorting, filters, pageSize, pageIndex }),
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
