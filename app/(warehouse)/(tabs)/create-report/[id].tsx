import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { useGetInventoryReporttById } from '@/hooks/useGetInventoryReportById';
import AppbarHeader from '@/components/common/AppBarHeader';
import HeaderCard from '@/components/warehouse-staff/HeaderCard';
import TeamCard from '@/components/warehouse-staff/TeamCard';
import PackagesList from '@/components/warehouse-staff/create-report/PackagesList';

const CreateInventoryReport = () => {
  const { id } = useLocalSearchParams();
  const { data, isSuccess } = useGetInventoryReporttById(id as string);
  if (!isSuccess) return null;

  return (
    <View style={styles.container}>
      <AppbarHeader title='Create Inventory Report' />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <HeaderCard
          code={data?.data.code}
          status={data?.data.status}
          createdAt={data?.data.createdAt}
          warehouseManager={data?.data?.warehouseManager}
        />
        <TeamCard warehouseStaff={data?.data.warehouseStaff} />
        <Divider />
        <PackagesList
          inventoryReportDetail={data?.data?.inventoryReportDetail}
          reportId={id as string}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    paddingHorizontal: 5,
    paddingBottom: 5,
  },
});

export default CreateInventoryReport;
