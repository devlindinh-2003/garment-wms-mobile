import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { Divider, Button } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { useGetInventoryReporttById } from '@/hooks/useGetInventoryReportById';
import AppbarHeader from '@/components/common/AppBarHeader';
import HeaderCard from '@/components/warehouse-staff/HeaderCard';
import TeamCard from '@/components/warehouse-staff/TeamCard';
import CameraComponent from '@/components/warehouse-staff/create-report/CameraComponent';
import { createInventoryReport } from '@/api/inventoryReport';
import PackagesList from '@/components/warehouse-staff/create-report/PackagesList';
import SpinnerLoading from '@/components/common/SpinnerLoading';

const CreateInventoryReport = () => {
  const { id } = useLocalSearchParams();
  const { data, isSuccess, isPending } = useGetInventoryReporttById(
    id as string
  );
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [processedDetails, setProcessedDetails] = useState<
    { inventoryReportDetailId: string; actualQuantity: number; note: string }[]
  >([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

  // Deconstruct data properties
  const {
    code,
    status,
    createdAt,
    warehouseManager,
    warehouseStaff,
    inventoryReportDetail,
  } = data?.data || {};

  const handleOpenCamera = () => setIsCameraOpen(true);
  const handleCloseCamera = () => setIsCameraOpen(false);
  const handleScanComplete = (data: string) => {
    setScannedData(data); // Pass scanned data to the list
    setIsCameraOpen(false);
  };

  const clearScannedData = () => setScannedData(null); // Function to clear scanned data

  const handleSubmit = async () => {
    if (processedDetails.length === 0) {
      Alert.alert('Error', 'No inventory details to submit.');
      return;
    }

    const requestBody = {
      details: processedDetails.map(
        ({ inventoryReportDetailId, actualQuantity, note }) => ({
          inventoryReportDetailId,
          actualQuantity,
          note,
        })
      ),
    };
    console.log('Request Body:', JSON.stringify(requestBody, null, 2));
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
    setIsSubmitDisabled(processedDetails.length === 0);
  }, [processedDetails]);

  if (isPending)
    return (
      <View style={styles.centered}>
        <SpinnerLoading />
      </View>
    );

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
            code={code}
            status={status}
            createdAt={createdAt}
            warehouseManager={warehouseManager}
          />
          <TeamCard warehouseStaff={warehouseStaff} />
          <Divider />
          <PackagesList
            inventoryReportDetail={inventoryReportDetail}
            scannedData={scannedData}
            onScanTrigger={handleOpenCamera}
            clearScannedData={clearScannedData} // Clear scanned data
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreateInventoryReport;
