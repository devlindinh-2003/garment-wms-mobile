import SpinnerLoading from '@/components/common/SpinnerLoading';
import ProductDetailCard from '@/components/inspected-detail/product/ProductDetailCard';
import ProductInspectionReport from '@/components/inspected-detail/product/ProductInspectionReport';
import ProductInspectionRequestInfo from '@/components/inspected-detail/product/ProductInspectionRequest';
import Theme from '@/constants/Theme';
import { useGetAllDefect } from '@/hooks/useGetAllDefect';
import { useGetInspectionReportById } from '@/hooks/useGetInspectionReportById';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';
import { Text } from 'react-native-paper';

const InspectedProductDetails = () => {
  const { id } = useLocalSearchParams();
  const { data, isSuccess, isPending } = useGetInspectionReportById(
    id as string
  );
  const { defectsList = [] } = useGetAllDefect();

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

    const totalMaterials =
      inspectionReportDetail?.reduce((acc: number, item: any) => {
        return acc + (item.quantityByPack || 0);
      }, 0) || 0;

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
    const totalCount = passCount + failCount;

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
        <ProductInspectionRequestInfo
          inspectionRequestCode={inspectionRequestCode}
          inspectionRequestStatus={inspectionRequestStatus}
          inspectionReportCreatedAt={inspectionReportCreatedAt}
          inspectionDeptName={inspectionDeptName}
          inspectionRequestNote={inspectionRequestNote}
          importRequestCode={importRequestCode}
          inspectionRequestDate={inspectionRequest?.createdAt}
        />
        {/* Inspection Report */}
        <ProductInspectionReport
          inspectionReportCode={inspectionReportCode}
          totalMaterials={totalMaterials || totalCount}
          chartData={chartData}
          failPercentage={failPercentage}
          passPercentage={passPercentage}
          inspectionReportDetails={inspectionReportDetail}
          allDefects={defectsList}
        />
      </ScrollView>
    );
  }

  return null;
};

export default InspectedProductDetails;
