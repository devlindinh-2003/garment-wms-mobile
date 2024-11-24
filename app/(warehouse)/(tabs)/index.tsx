import SpinnerLoading from '@/components/common/SpinnerLoading';
import InventoryReportList from '@/components/warehouse-staff/inventory-report-plan/InventoryReportPlanList';
import { useGetAllInventoryReportPlan } from '@/hooks/useGetAllInventoryReportPlan';
import React from 'react';
import { View } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';

const WarehouseStaffDashboard = () => {
  const { data, isPending, isError } = useGetAllInventoryReportPlan();

  if (isPending) {
    return (
      <View className='flex-1 justify-center items-center'>
        <SpinnerLoading />
      </View>
    );
  }

  if (isError) {
    return (
      <View className='flex-1 justify-center items-center'>
        <Text>Error fetching inventory report plans. Please try again.</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-gray-100 px-4 py-2'>
      <Text className='text-2xl font-bold mb-4 text-center text-primaryLight'>
        Inventory Report Plans
      </Text>
      <InventoryReportList inventoryReportPlans={data?.data ?? []} />
    </View>
  );
};

export default WarehouseStaffDashboard;
