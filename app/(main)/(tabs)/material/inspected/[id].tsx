import React from 'react';
import { ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useGetInspectionReportById } from '@/hooks/useGetInspectionReportById';
import MaterialInspectionRequestInfo from '@/components/inspected-detail/material/MaterialInspectionRequest';
import MaterialInspectionReport from '@/components/inspected-detail/material/MaterialInspectionReport';
import SpinnerLoading from '@/components/common/SpinnerLoading';
import Theme from '@/constants/Theme';
import { Text } from 'react-native-paper';
import { useGetAllDefect } from '@/hooks/useGetAllDefect';
import { InspectionRequestType } from '@/enums/inspectionRequestType';

const InspectedDetails = () => {
  const { id } = useLocalSearchParams();
  const { data, isSuccess, isPending } = useGetInspectionReportById(
    id as string
  );
  const { defectsList = [] } = useGetAllDefect();
  const materialDefects = defectsList.filter(
    (defect: any) => defect.type === InspectionRequestType.MATERIAL
  );
  if (isPending) {
    return <SpinnerLoading />;
  }

  if (isSuccess && data) {
    const {
      code: inspectionReportCode,
      createdAt: inspectionReportCreatedAt,
      inspectionRequest,
      inspectionReportDetail,
    } = data.data;

    const inspectionRequestCode = inspectionRequest?.code || 'N/A';
    const inspectionRequestNote = inspectionRequest?.note || 'N/A';
    const inspectionDeptName =
      inspectionRequest?.inspectionDepartment?.account?.firstName &&
      inspectionRequest?.inspectionDepartment?.account?.lastName
        ? `${inspectionRequest.inspectionDepartment.account.firstName} ${inspectionRequest.inspectionDepartment.account.lastName}`
        : 'N/A';
    const inspectionRequestStatus = inspectionRequest?.status || 'N/A';
    const importRequestCode = inspectionRequest?.importRequest?.code || 'N/A';
    const importRequestStatus =
      inspectionRequest?.importRequest?.status || 'N/A';

    const passCount =
      inspectionReportDetail?.reduce(
        (acc: number, item: any) => acc + (item.approvedQuantityByPack || 0),
        0
      ) || 0;
    const failCount =
      inspectionReportDetail?.reduce(
        (acc: number, item: any) => acc + (item.defectQuantityByPack || 0),
        0
      ) || 0;
    // Calculate totals
    const totalMaterials =
      inspectionReportDetail?.reduce((acc: number, item: any) => {
        if (item.quantityByPack !== null) {
          return acc + item.quantityByPack;
        }
        return (
          acc +
          (item.approvedQuantityByPack || 0) +
          (item.defectQuantityByPack || 0)
        );
      }, 0) || 0;
    const totalCount = totalMaterials + passCount;
    console.log('Pass Count:', passCount);
    console.log('Fail Count:', failCount);
    console.log('Total Count:', totalCount);

    const passPercentage = totalMaterials
      ? ((passCount / totalMaterials) * 100).toFixed(0)
      : '0';
    const failPercentage = totalMaterials
      ? ((failCount / totalMaterials) * 100).toFixed(0)
      : '0';

    const chartData = [
      {
        value: failCount,
        frontColor: Theme.red[500],
        label: 'Fail',
        topLabelComponent: () => (
          <Text
            style={{
              color: Theme.red[500],
              fontSize: 18,
              marginBottom: 6,
              fontWeight: 'bold',
            }}
          >
            {failCount}
          </Text>
        ),
      },
      {
        value: passCount,
        frontColor: Theme.green[500],
        label: 'Pass',
        topLabelComponent: () => (
          <Text
            style={{
              color: Theme.green[500],
              fontSize: 18,
              marginBottom: 6,
              fontWeight: 'bold',
            }}
          >
            {passCount}
          </Text>
        ),
      },
    ];
    return (
      <ScrollView className='bg-white px-2 py-4 mb-3'>
        {/* Inspection Request Info */}
        <MaterialInspectionRequestInfo
          inspectionRequestCode={inspectionRequestCode}
          inspectionRequestStatus={inspectionRequestStatus}
          inspectionReportCreatedAt={inspectionReportCreatedAt}
          inspectionDeptName={inspectionDeptName}
          inspectionRequestNote={inspectionRequestNote}
          importRequestCode={importRequestCode}
          importRequestStatus={importRequestStatus}
          inspectionRequestDate={inspectionRequest?.createdAt}
        />
        {/* Inspection Report */}
        <MaterialInspectionReport
          inspectionReportCode={inspectionReportCode}
          totalMaterials={totalMaterials}
          chartData={chartData}
          failPercentage={failPercentage}
          passPercentage={passPercentage}
          inspectionReportDetails={inspectionReportDetail}
          importRequest={inspectionRequest?.importRequest}
          allDefects={materialDefects}
        />
      </ScrollView>
    );
  }

  return null;
};

export default InspectedDetails;
