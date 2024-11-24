import { useRouter } from 'expo-router';
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
import { useGetAllDefect } from '@/hooks/useGetAllDefect';

const CreateMaterialReport = () => {
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
      defects: { defectId: string; quantityByPack: number }[];
    }[]
  >([]);
  const [snackbarVisibleSuccess, setSnackbarVisibleSuccess] = useState(false);
  const [snackbarVisibleError, setSnackbarVisibleError] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { defectsList = [] } = useGetAllDefect();

  const handleReportUpdate = (
    id: string,
    pass: number,
    fail: number,
    isValid: boolean,
    defects: { defectId: string; quantityByPack: number }[]
  ) => {
    setReportDetails((prevDetails) => {
      const existingDetail = prevDetails.find((detail) => detail.id === id);
      if (existingDetail) {
        return prevDetails.map((detail) =>
          detail.id === id ? { id, pass, fail, isValid, defects } : detail
        );
      }
      return [...prevDetails, { id, pass, fail, isValid, defects }];
    });
  };

  const allInputsValid = data?.data.importRequest.importRequestDetail?.every(
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

    const inspectionReportDetail = reportDetails.map((detail) => {
      const correspondingImportDetail =
        data?.data.importRequest.importRequestDetail?.find(
          (importDetail: ImportRequestDetail) => importDetail.id === detail.id
        );

      if (!correspondingImportDetail) {
        console.error(`No matching import detail found for id: ${detail.id}`);
        return null;
      }

      const detailObject: any = {
        approvedQuantityByPack: detail.pass,
        defectQuantityByPack: detail.fail,
        materialPackageId:
          correspondingImportDetail.materialPackage?.id || null,
      };

      const validDefects = detail.defects.filter(
        (defect) => defect.quantityByPack > 0
      );

      if (validDefects.length > 0) {
        detailObject.inspectionReportDetailDefect = validDefects.map(
          (defect) => ({
            defectId: defect.defectId,
            quantityByPack: defect.quantityByPack,
          })
        );
      }

      return detailObject;
    });

    const filteredInspectionReportDetail = inspectionReportDetail.filter(
      (reportDetail) => reportDetail !== null
    );

    const requestBody = {
      inspectionRequestId: id as string,
      inspectionDepartmentId: data?.data.inspectionDepartment?.id || '',
      type: data?.data.type,
      inspectionReportDetail: filteredInspectionReportDetail,
    };

    console.log('Request Body:', JSON.stringify(requestBody, null, 2));

    mutate(requestBody, {
      onSuccess: (response) => {
        setSnackbarMessage('Report submitted successfully!');
        setSnackbarVisibleSuccess(true);
        router.push({
          pathname: '/(main)/(tabs)/material/inspected/[id]',
          params: { id: response.data?.inspectionReport?.id || '' },
        });
      },
      onError: (error) => {
        console.error('Error submitting report:', error.message);
        setSnackbarMessage('Failed to submit the report.');
        setSnackbarVisibleError(true);
      },
    });
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

          {importRequestDetail?.map((detail: ImportRequestDetail) => (
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
              onUpdate={(pass, fail, isValid, defects) =>
                handleReportUpdate(detail.id, pass, fail, isValid, defects)
              }
              defects={defectsList} // Pass dynamically fetched defects
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
            backgroundColor: Theme.success,
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
            backgroundColor: Theme.error,
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
