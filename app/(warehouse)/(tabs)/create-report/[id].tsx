import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
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
import { useSnackbar } from '@/app/_layout';

const CreateInventoryReport = () => {
  const { showSnackbar } = useSnackbar();
  const { id } = useLocalSearchParams();
  const { data, isSuccess, isPending } = useGetInventoryReporttById(
    id as string
  );
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

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
    setScannedData(data);
    setIsCameraOpen(false);
  };

  const clearScannedData = () => setScannedData(null);

  const handleValidationChange = (isValid: boolean) => {
    setIsSubmitDisabled(!isValid);
  };

  const handleSubmit = async () => {
    if (!inventoryReportDetail) {
      showSnackbar('No inventory details found.', 'error');
      return;
    }

    const processedDetails: any = [];
    inventoryReportDetail.forEach((detail: any) => {
      detail.materialPackages?.forEach((pkg: any) => {
        pkg.inventoryReportDetails?.forEach((item: any) => {
          if (item.actualQuantity !== null) {
            processedDetails.push({
              inventoryReportDetailId: item.id,
              actualQuantity: item.actualQuantity,
              note: `Material Receipt: ${item.materialReceipt?.code || ''}`,
            });
          }
        });
      });
      detail.productSizes?.forEach((size: any) => {
        size.inventoryReportDetails?.forEach((item: any) => {
          if (item.actualQuantity !== null) {
            processedDetails.push({
              inventoryReportDetailId: item.id,
              actualQuantity: item.actualQuantity,
              note: `Product Receipt: ${item.productReceipt?.code || ''}`,
            });
          }
        });
      });
    });

    if (processedDetails.length === 0) {
      showSnackbar('No inventory details to submit.', 'success');
      return;
    }

    const requestBody = { details: processedDetails };
    console.log(JSON.stringify(requestBody, null, 2));

    try {
      await createInventoryReport(id as string, requestBody);
      showSnackbar('Inventory report submitted successfully.', 'success');
      router.replace({
        pathname: '/(warehouse)/(tabs)/reported/[id]',
        params: { id },
      });
    } catch (error: any) {
      showSnackbar(`${error.message}.`, 'error');
    }
  };

  if (isPending) {
    return (
      <View style={styles.centered}>
        <SpinnerLoading />
      </View>
    );
  }

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
            clearScannedData={clearScannedData}
            onValidationChange={handleValidationChange} // Pass validation change handler
          />
        </ScrollView>
      )}

      <View style={styles.footer}>
        <Button
          icon='arrow-right-drop-circle'
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
