import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { Divider, Button } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { useGetInventoryReporttById } from '@/hooks/useGetInventoryReportById';
import AppbarHeader from '@/components/common/AppBarHeader';
import HeaderCard from '@/components/warehouse-staff/HeaderCard';
import TeamCard from '@/components/warehouse-staff/TeamCard';
import PackagesList from '@/components/warehouse-staff/create-report/PackagesList';
import CameraComponent from '@/components/warehouse-staff/create-report/CameraComponent';
import { createInventoryReport } from '@/api/inventoryReport';

const CreateInventoryReport = () => {
  const { id } = useLocalSearchParams();
  const { data, isSuccess } = useGetInventoryReporttById(id as string);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [filteredPackages, setFilteredPackages] = useState<
    { query: string; package: any }[]
  >([]);
  const [processedDetails, setProcessedDetails] = useState<
    { inventoryReportDetailId: string; actualQuantity: number; note: string }[]
  >([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

  const handleOpenCamera = () => setIsCameraOpen(true);
  const handleCloseCamera = () => setIsCameraOpen(false);
  const handleScanComplete = (data: string) => {
    setScannedData(data);
    setIsCameraOpen(false);
  };

  const handleSubmit = async () => {
    if (processedDetails.length === 0) {
      Alert.alert('Error', 'No inventory details to submit.');
      return;
    }
    const requestBody = { details: processedDetails };
    try {
      await createInventoryReport(id as string, requestBody);
      Alert.alert('Success', 'Inventory report submitted successfully.');
      router.replace({
        pathname: '/(warehouse)/(tabs)/reported/[id]',
        params: { id },
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit the report.');
    }
  };

  useEffect(() => {
    if (!data?.data?.inventoryReportDetail) return;

    const allMaterialReceipts =
      data.data.inventoryReportDetail.flatMap(
        (detail: any) =>
          detail?.materialPackages?.flatMap((pkg: any) =>
            pkg?.inventoryReportDetails?.map((item: any) => item?.id)
          ) || []
      ) || [];

    const allReported = allMaterialReceipts.every((receiptId: any) =>
      processedDetails.some(
        (detail) => detail?.inventoryReportDetailId === receiptId
      )
    );

    setIsSubmitDisabled(!allReported);
  }, [processedDetails, data]);

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
            code={data?.data?.code}
            status={data?.data?.status}
            createdAt={data?.data?.createdAt}
            warehouseManager={data?.data?.warehouseManager}
          />
          <TeamCard warehouseStaff={data?.data?.warehouseStaff} />
          <Divider />
          <PackagesList
            inventoryReportDetail={data?.data?.inventoryReportDetail || []}
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

      <View style={styles.footer}>
        <Button
          mode='contained'
          onPress={handleSubmit}
          disabled={isSubmitDisabled}
          buttonColor='#4CAF50'
        >
          Submit Report
        </Button>
      </View>
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
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: 'white',
  },
});

export default CreateInventoryReport;
