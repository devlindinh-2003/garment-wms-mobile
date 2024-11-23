import { useCreateInspectionReport } from '@/hooks/useCreateInspectionReport';
import { useGetInspectionRequestById } from '@/hooks/useGetInspectionRequestById';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';

const CreateProductReport = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data, isSuccess, isPending } = useGetInspectionRequestById(
    id as string
  );
  const { mutate, isPending: isCreatingReport } = useCreateInspectionReport();
  const [reportDetails, setReportDetails] = useState<
    {
      id: string;
      pass: number;
      fail: number;
      isValid: boolean;
    }[]
  >([]);
  const [snackbarVisibleSuccess, setSnackbarVisibleSuccess] = useState(false);
  const [snackbarVisibleError, setSnackbarVisibleError] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  return <div></div>;
};

export default CreateProductReport;
