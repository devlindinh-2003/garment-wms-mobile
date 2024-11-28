import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { useGetInventoryReporttById } from '@/hooks/useGetInventoryReportById';
import AppbarHeader from '@/components/common/AppBarHeader';
import HeaderCard from '@/components/warehouse-staff/HeaderCard';
import TeamCard from '@/components/warehouse-staff/TeamCard';
import PackagesList from '@/components/warehouse-staff/create-report/PackagesList';
import CameraComponent from '@/components/warehouse-staff/create-report/CameraComponent';

const CreateInventoryReport = () => {
  const { id } = useLocalSearchParams();
  const { data, isSuccess } = useGetInventoryReporttById(id as string);
  const [isCameraOpen, setIsCameraOpen] = useState(false); // Manage camera visibility state
  const [scannedData, setScannedData] = useState<string | null>(null); // Store scanned QR code data
  const [filteredPackages, setFilteredPackages] = useState<
    { query: string; package: any }[]
  >([]); // Lifted state for filtered packages
  const [processedDetails, setProcessedDetails] = useState<
    { inventoryReportDetailId: string; actualQuantity: number; note: string }[]
  >([]); // Lifted state for processed details

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  const handleScanComplete = (data: string) => {
    setScannedData(data); // Save scanned data
    setIsCameraOpen(false);
  };

  if (!isSuccess) return null;

  return (
    <View style={styles.container}>
      {!isCameraOpen && <AppbarHeader title='Create Inventory Report' />}
      {isCameraOpen ? (
        <CameraComponent
          onClose={handleCloseCamera}
          onScanComplete={handleScanComplete}
        />
      ) : (
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
            scannedData={scannedData}
            onOpenCamera={handleOpenCamera}
            filteredPackages={filteredPackages}
            setFilteredPackages={setFilteredPackages}
            processedDetails={processedDetails}
            setProcessedDetails={setProcessedDetails}
          />
        </ScrollView>
      )}
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
