import React from 'react';
import { ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useGetInspectionRequestById } from '@/hooks/useGetInspectionRequestById';
import MaterialInspectionRequestInfo from '@/components/inspected-detail/material/MaterialInspectionRequest';
import MaterialInspectionReport from '@/components/inspected-detail/material/MaterialInspectionReport';
import Theme from '@/constants/Theme';

const InspectedDetails = () => {
  const { id } = useLocalSearchParams();
  const { data, isSuccess } = useGetInspectionRequestById(id as string);

  if (isSuccess && data) {
    const {
      code: inspectionRequestCode,
      status: inspectionRequestStatus,
      createdAt: inspectionReportCreatedAt,
      note: inspectionRequestNote,
      inspectionDepartment,
      inspectionReport,
    } = data.data;

    const inspectionDeptFirstName =
      inspectionDepartment?.account?.firstName || 'N/A';
    const inspectionDeptLastName =
      inspectionDepartment?.account?.lastName || 'N/A';

    const totalMaterials =
      inspectionReport?.inspectionReportDetail.reduce(
        (acc: number, item: { quantityByPack: number }) =>
          acc + item.quantityByPack,
        0
      ) || 0;

    const passCount =
      inspectionReport?.inspectionReportDetail.reduce(
        (acc: number, item: { approvedQuantityByPack: number }) =>
          acc + item.approvedQuantityByPack,
        0
      ) || 0;

    const failCount =
      inspectionReport?.inspectionReportDetail.reduce(
        (acc: number, item: { defectQuantityByPack: number }) =>
          acc + item.defectQuantityByPack,
        0
      ) || 0;
    const passPercentage = ((passCount / totalMaterials) * 100).toFixed(0);
    const failPercentage = ((failCount / totalMaterials) * 100).toFixed(0);
    const chartData = [
      {
        value: parseFloat(failPercentage),
        frontColor: Theme.red[500],
        label: 'Fail',
      },
      {
        value: parseFloat(passPercentage),
        frontColor: Theme.green[500],
        label: 'Pass',
      },
    ];

    return (
      <ScrollView className='bg-white px-2 py-4'>
        {/* Inspect Request Info */}
        <MaterialInspectionRequestInfo
          inspectionRequestCode={inspectionRequestCode}
          inspectionRequestStatus={inspectionRequestStatus}
          inspectionReportCreatedAt={inspectionReportCreatedAt}
          inspectionDeptFirstName={inspectionDeptFirstName}
          inspectionDeptLastName={inspectionDeptLastName}
          inspectionRequestNote={inspectionRequestNote}
        />
        {/* Inspection Report */}
        <MaterialInspectionReport
          inspectionReportCode={inspectionReport?.code || 'N/A'}
          totalMaterials={totalMaterials}
          chartData={chartData}
          failPercentage={failPercentage}
          passPercentage={passPercentage}
        />
      </ScrollView>
    );
  }

  return null;
};

export default InspectedDetails;
