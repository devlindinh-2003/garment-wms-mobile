import {
  createInspectionReport,
  CreateInspectionReportParams,
} from '@/api/inspectionReport';
import { ApiResponse } from '@/types/ApiResponse';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useCreateInspectionReport = () => {
  const mutation = useMutation<
    ApiResponse,
    AxiosError,
    CreateInspectionReportParams
  >({
    mutationFn: async (data: CreateInspectionReportParams) => {
      try {
        const response = await createInspectionReport(data);
        return response;
      } catch (error) {
        console.error('Failed to create inspection report:');
        throw error; // Ensure error is re-thrown for `onError` handling
      }
    },
    onSuccess: (data) => {
      console.log('Inspection report created successfully:', data);
    },
    onError: (error) => {
      console.error('Error creating inspection report:', error.message);
    },
  });

  return mutation;
};
