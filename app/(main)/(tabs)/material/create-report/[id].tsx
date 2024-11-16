import SpinnerLoading from '@/components/common/SpinnerLoading';
import MaterialInspectingCard from '@/components/inspecting-process/material/MaterialInspectingCard';
import MaterialInspectionRequest from '@/components/inspecting-process/material/MaterialInspectionRequest';
import { useGetInspectionRequestById } from '@/hooks/useGetInspectionRequestById';
import { ImportRequestDetail } from '@/types/ImportRequestType';
import { useCreateInspectionReport } from '@/hooks/useCreateInspectionReport';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from 'react-native-paper';

const CreateMaterialReport = () => {
  const { id } = useLocalSearchParams();
  const { data, isSuccess, isPending } = useGetInspectionRequestById(
    id as string
  );
  const { mutate, isPending: isCreatingReport } = useCreateInspectionReport();
  const [reportDetails, setReportDetails] = useState<
    { id: string; pass: number; fail: number }[]
  >([]);

  const handleReportUpdate = (id: string, pass: number, fail: number) => {
    setReportDetails((prevDetails) => {
      const existingDetail = prevDetails.find((detail) => detail.id === id);
      if (existingDetail) {
        return prevDetails.map((detail) =>
          detail.id === id ? { id, pass, fail } : detail
        );
      }
      return [...prevDetails, { id, pass, fail }];
    });
  };

  const handleSendReport = () => {
    const requestBody = {
      inspectionRequestId: id as string,
      inspectionDepartmentId: data?.data.inspectionDepartment?.id || '',
      inspectionReportDetail: reportDetails.map((detail) => ({
        approvedQuantityByPack: detail.pass,
        defectQuantityByPack: detail.fail,
        materialVariantId: detail.id,
      })),
    };

    console.log('Inspection Report Request Body:');
    console.log(JSON.stringify(requestBody, null, 2));

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
        {/* Material Inspection Request Info */}
        <MaterialInspectionRequest
          inspectionRequestCode={inspectionRequestCode}
          inspectionRequestStatus={inspectionRequestStatus}
          inspectionRequestCreatedAt={inspectionRequestCreatedAt}
          inspectionDeptFirstName={inspectionDeptFirstName}
          inspectionDeptLastName={inspectionDeptLastName}
          inspectionRequestNote={inspectionRequestNote}
          managerName={managerName}
        />

        {/* Inspecting Material List */}
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
            onUpdate={(pass, fail) => handleReportUpdate(detail.id, pass, fail)}
          />
        ))}

        {/* Send Report Button */}
        <View className='mt-4 mb-20'>
          <Button
            icon='send'
            mode='contained'
            onPress={handleSendReport}
            className='bg-primaryLight'
            labelStyle={{ color: 'white', fontWeight: 'bold' }}
            disabled={isCreatingReport}
          >
            Send Report
          </Button>
        </View>
      </ScrollView>
    );
  }

  return null;
};

export default CreateMaterialReport;
