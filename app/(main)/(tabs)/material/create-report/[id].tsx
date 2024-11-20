import SpinnerLoading from '@/components/common/SpinnerLoading';
import MaterialInspectingCard from '@/components/inspecting-process/material/MaterialInspectingCard';
import MaterialInspectionRequest from '@/components/inspecting-process/material/MaterialInspectionRequest';
import { useGetInspectionRequestById } from '@/hooks/useGetInspectionRequestById';
import { ImportRequestDetail } from '@/types/ImportRequestType';
import { useCreateInspectionReport } from '@/hooks/useCreateInspectionReport';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';
import Theme from '@/constants/Theme';

const CreateMaterialReport = () => {
  const { id } = useLocalSearchParams();
  const { data, isSuccess, isPending } = useGetInspectionRequestById(
    id as string
  );
  const { mutate, isPending: isCreatingReport } = useCreateInspectionReport();
  const [reportDetails, setReportDetails] = useState<
    { id: string; pass: number; fail: number; isValid: boolean }[]
  >([]);
  const [snackbarVisibleSuccess, setSnackbarVisibleSuccess] = useState(false);
  const [snackbarVisibleError, setSnackbarVisibleError] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleReportUpdate = (
    id: string,
    pass: number,
    fail: number,
    isValid: boolean
  ) => {
    setReportDetails((prevDetails) => {
      const existingDetail = prevDetails.find((detail) => detail.id === id);
      if (existingDetail) {
        return prevDetails.map((detail) =>
          detail.id === id ? { id, pass, fail, isValid } : detail
        );
      }
      return [...prevDetails, { id, pass, fail, isValid }];
    });
  };

  const allInputsValid = data?.data.importRequest.importRequestDetail.every(
    (detail: ImportRequestDetail) => {
      const reportDetail = reportDetails.find((d) => d.id === detail.id);
      return reportDetail && reportDetail.isValid;
    }
  );

  const handleSendReport = () => {
    if (!allInputsValid) {
      setSnackbarMessage(
        'Please fill in all inputs and fix errors before submitting.'
      );
      setSnackbarVisibleError(true);
      return;
    }

    const inspectionReportDetail = reportDetails
      .map((detail) => {
        const correspondingImportDetail =
          data?.data.importRequest.importRequestDetail.find(
            (importDetail: ImportRequestDetail) => importDetail.id === detail.id
          );

        if (!correspondingImportDetail) {
          console.error(`No matching import detail found for id: ${detail.id}`);
          return null;
        }

        return {
          approvedQuantityByPack: detail.pass,
          defectQuantityByPack: detail.fail,
          materialPackageId: correspondingImportDetail.materialPackage.id,
        };
      })
      .filter((reportDetail) => reportDetail !== null);

    const requestBody = {
      inspectionRequestId: id as string,
      inspectionDepartmentId: data?.data.inspectionDepartment?.id || '',
      type: data?.data.type,
      inspectionReportDetail,
    };

    console.log('Request Body:', JSON.stringify(requestBody, null, 2));
    // mutate(requestBody, {
    //   onSuccess: () => {
    //     setSnackbarMessage('Report submitted successfully!');
    //     setSnackbarVisibleSuccess(true);
    //   },
    //   onError: (error) => {
    //     console.error('Error submitting report:', error.message);
    //     setSnackbarMessage('Failed to submit the report.');
    //     setSnackbarVisibleError(true);
    //   },
    // });
  };

  if (isPending) {
    return <SpinnerLoading />;
  }

  if (isSuccess && data) {
    const {
      code: inspectionRequestCode,
      status: inspectionRequestStatus,
      createdAt: inspectionRequestCreatedAt,
      note: inspectionRequestNote,
      inspectionDepartment,
      warehouseManager,
      importRequest: { importRequestDetail },
    } = data.data;

    const inspectionDeptFirstName =
      inspectionDepartment?.account?.firstName || 'N/A';
    const inspectionDeptLastName =
      inspectionDepartment?.account?.lastName || 'N/A';
    const managerName = `${warehouseManager?.account?.firstName || 'N/A'} ${
      warehouseManager?.account?.lastName || 'N/A'
    }`;

    return (
      <>
        <ScrollView className='p-4 bg-white'>
          <MaterialInspectionRequest
            inspectionRequestCode={inspectionRequestCode}
            inspectionRequestStatus={inspectionRequestStatus}
            inspectionRequestCreatedAt={inspectionRequestCreatedAt}
            inspectionDeptFirstName={inspectionDeptFirstName}
            inspectionDeptLastName={inspectionDeptLastName}
            inspectionRequestNote={inspectionRequestNote}
            managerName={managerName}
          />

          {importRequestDetail.map((detail: ImportRequestDetail) => (
            <MaterialInspectingCard
              key={detail.id}
              image={detail.materialPackage.materialVariant.image}
              name={detail.materialPackage.name}
              code={detail.materialPackage.code}
              height={`${detail.materialPackage.packedHeight}m`}
              width={`${detail.materialPackage.packedWidth}m`}
              weight={`${detail.materialPackage.packedWeight}kg`}
              length={`${detail.materialPackage.packedLength}m`}
              total={detail.quantityByPack}
              pass={0}
              fail={0}
              onUpdate={(pass, fail, isValid) =>
                handleReportUpdate(detail.id, pass, fail, isValid)
              }
            />
          ))}

          <View className='mt-4 mb-20'>
            <Button
              icon='send'
              mode='contained'
              onPress={handleSendReport}
              buttonColor={Theme.primaryLightBackgroundColor}
              disabled={!allInputsValid || isCreatingReport}
              labelStyle={{
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {isCreatingReport ? 'Submitting...' : 'Send Report'}
            </Button>
          </View>
        </ScrollView>
        <Snackbar
          visible={snackbarVisibleSuccess}
          onDismiss={() => setSnackbarVisibleSuccess(false)}
          duration={3000}
          style={{
            backgroundColor: 'rgb(34, 197, 94)', // Green for success
            borderRadius: 6,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {snackbarMessage}
          </Text>
        </Snackbar>
        <Snackbar
          visible={snackbarVisibleError}
          onDismiss={() => setSnackbarVisibleError(false)}
          duration={3000}
          style={{
            backgroundColor: 'rgb(239, 68, 68)', // Red for error
            borderRadius: 6,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {snackbarMessage}
          </Text>
        </Snackbar>
      </>
    );
  }

  return null;
};

export default CreateMaterialReport;
