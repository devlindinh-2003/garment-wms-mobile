import SpinnerLoading from '@/components/common/SpinnerLoading';
import MaterialInspectingCard from '@/components/inspecting-process/material/MaterialInspectingCard';
import MaterialInspectionRequest from '@/components/inspecting-process/material/MaterialInspectionRequest';
import { useGetInspectionRequestById } from '@/hooks/useGetInspectionRequestById';
import { ImportRequestDetail } from '@/types/ImportRequestType';
import { useCreateInspectionReport } from '@/hooks/useCreateInspectionReport';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Button } from 'react-native-paper';
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
  const [specialCharacterError, setSpecialCharacterError] = useState(false);

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

  const handlePhoneValidation = (phone: string) => {
    const hasSpecialCharacter = /[^\w\s]/.test(phone); // Regex to detect special characters
    setSpecialCharacterError(hasSpecialCharacter);
  };

  const allInputsValid = data?.data.importRequest.importRequestDetail.every(
    (detail: ImportRequestDetail) => {
      const reportDetail = reportDetails.find((d) => d.id === detail.id);
      return reportDetail && reportDetail.isValid;
    }
  );

  const handleSendReport = () => {
    if (!allInputsValid) {
      alert('Please fill in all inputs and fix errors before submitting.');
      return;
    }

    const requestBody = {
      inspectionRequestId: id as string,
      inspectionDepartmentId: data?.data.inspectionDepartment?.id || '',
      inspectionReportDetail: reportDetails.map((detail) => ({
        approvedQuantityByPack: detail.pass,
        defectQuantityByPack: detail.fail,
        materialVariantId: detail.id,
      })),
    };

    mutate(requestBody, {
      onSuccess: () => {
        alert('Report submitted successfully!');
      },
      onError: (error) => {
        console.error('Error submitting report:', error);
        alert('Failed to submit the report.');
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
    const managerName = `${warehouseManager?.account?.firstName || 'N/A'} ${warehouseManager?.account?.lastName || 'N/A'}`;

    return (
      <ScrollView className='p-4 bg-white'>
        {specialCharacterError && (
          <Text className='text-red-600 font-bold mb-2'>
            Phone number contains invalid characters. Please use only numbers.
          </Text>
        )}
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
    );
  }

  return null;
};

export default CreateMaterialReport;
