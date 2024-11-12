import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { InspectionRequestType } from '@/enums/inspectionRequestType';
import { getInspectionStatisticByType } from '@/api/inspectionRequest';

export const useGetInspectionStatisticByType = (
  type: InspectionRequestType
) => {
  const { data, status, isPending, isError, isSuccess, isFetching } = useQuery<
    ApiResponse,
    AxiosError
  >({
    queryKey: ['inspectionStatistic', type],
    queryFn: () => getInspectionStatisticByType(type),
    enabled: !!type,
  });

  return { data, status, isPending, isError, isSuccess, isFetching };
};
