import React from 'react';
import { ScrollView } from 'react-native';
import MaterialStatistic from '@/components/material/MaterialStatistic';
import { Text } from 'react-native-paper';
import MaterialList from '@/components/material/MaterialList';
import { useGetAllInspectionRequest } from '@/hooks/useGetAllInspectionRequest';
import { InspectionRequestType } from '@/enums/inspectionRequestType';
import { InspectionRequestStatus } from '@/enums/inspectionRequestStatus';

const MaterialPage = () => {
  const { data, isPending, isError, isSuccess } = useGetAllInspectionRequest({
    pageSize: 10,
    pageIndex: 0,
  });

  // Filter for inspected materials
  const inspectedMaterialList = isSuccess
    ? data?.data.filter(
        (request) =>
          request.type === InspectionRequestType.MATERIAL &&
          request.status === InspectionRequestStatus.INSPECTED
      ) || []
    : [];

  // Filter for inspecting materials
  const inspectingMaterialList = isSuccess
    ? data?.data.filter(
        (request) =>
          request.type === InspectionRequestType.MATERIAL &&
          request.status === InspectionRequestStatus.INSPECTING
      ) || []
    : [];

  return (
    <ScrollView className='px-4 py-3 bg-gray-100 space-y-3'>
      <Text
        style={{ fontWeight: 'bold' }}
        variant='titleLarge'
        className='text-primaryLight capitalize mb-2 text-center'
      >
        Raw Material Statistics
      </Text>
      {/* Material Statistic */}
      <MaterialStatistic />
      {/* Material List with both inspected and inspecting requests */}
      <MaterialList
        inspectedRequests={inspectedMaterialList}
        inspectingRequests={inspectingMaterialList}
      />
    </ScrollView>
  );
};

export default MaterialPage;
