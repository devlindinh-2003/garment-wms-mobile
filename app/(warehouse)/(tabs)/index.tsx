import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import SpinnerLoading from '@/components/common/SpinnerLoading';
import InventoryReportPlanList from '@/components/warehouse-staff/inventory-report-plan/InventoryReportPlanList';
import { getWarehouseStaffInventoryReport } from '@/api/inventoryReportPlan';

const WarehouseStaffDashboard = () => {
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(inventoryData.length);

  useEffect(() => {
    const fetchInventoryReports = async () => {
      try {
        setIsLoading(true);
        const data = await getWarehouseStaffInventoryReport({
          pageSize: 99,
          pageIndex: 0,
        });
        setInventoryData(data?.data?.data ?? []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching inventory data:', err.message);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryReports();
  }, []);

  if (isLoading) {
    return (
      <View className='flex-1 justify-center items-center'>
        <SpinnerLoading />
      </View>
    );
  }

  if (error) {
    return (
      <View className='flex-1 justify-center items-center'>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-gray-100 px-4 py-2'>
      <Text className='text-2xl font-bold mb-4 text-center text-primaryLight'>
        Inventory Report Plans
      </Text>
      <InventoryReportPlanList inventoryReportPlans={inventoryData} />
    </View>
  );
};

export default WarehouseStaffDashboard;
