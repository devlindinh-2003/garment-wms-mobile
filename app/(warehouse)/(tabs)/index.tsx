import { useGetAllInventoryReportPlan } from '@/hooks/useGetAllInventoryReportPlan';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const WarehouseStaffDashboard = () => {
  const { data, error, isPending, isError, isSuccess, refetch } =
    useGetAllInventoryReportPlan();
  console.log(JSON.stringify(data, null, 2));
  return (
    <View>
      <Text>This is warehouse stafft</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default WarehouseStaffDashboard;
