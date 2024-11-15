import {
  createInspectionReport,
  CreateInspectionReportParams,
} from '@/api/inspectionRequest';
import { ApiResponse } from '@/types/ApiResponse';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useCreateInspectionReport = () => {
  const mutation = useMutation<
    ApiResponse,
    AxiosError,
    CreateInspectionReportParams
  >({
    mutationFn: createInspectionReport,
    onSuccess: (data) => {
      console.log('Inspection report created successfully:', data);
    },
    onError: (error) => {
      console.error('Error creating inspection report:', error.message);
    },
  });
  return mutation;
};
