import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Button, Divider, Snackbar, Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { createInventoryReport } from '@/api/inventoryReport';
import { useGetInventoryReporttById } from '@/hooks/useGetInventoryReportById';
import AppbarHeader from '@/components/common/AppBarHeader';
import HeaderCard from '@/components/warehouse-staff/HeaderCard';
import TeamCard from '@/components/warehouse-staff/TeamCard';
import Theme from '@/constants/Theme';
import PackagesList from '@/components/warehouse-staff/create-report/PackagesList';

const CreateInventoryReport = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data, isSuccess } = useGetInventoryReporttById(id as string);
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [savedDetails, setSavedDetails] = useState<any[]>([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isSuccess && data?.data?.inventoryReportDetail) {
      const initialInputs: Record<string, any> = {};
      data.data.inventoryReportDetail.forEach((detail: any) => {
        detail.materialPackages.forEach((materialPackage: any) => {
          materialPackage.inventoryReportDetails.forEach(
            (inventoryDetail: any) => {
              initialInputs[inventoryDetail.id] = {
                actualQuantity: '',
                notes: '',
                isSaved: false,
                isEditable: true,
              };
            }
          );
        });
      });
      setInputs(initialInputs);
    }
  }, [isSuccess, data]);

  const allInputsValid = savedDetails.every(
    (detail) => inputs[detail.id]?.isValid
  );

  const handleSubmit = async () => {
    if (!allInputsValid) {
      setSnackbarMessage('Please fill in all fields and fix errors.');
      setSnackbarVisible(true);
      return;
    }

    setIsSubmitting(true);

    const details = savedDetails.map((detail) => ({
      inventoryReportDetailId: detail.id,
      actualQuantity: parseInt(inputs[detail.id].actualQuantity, 10),
      note: inputs[detail.id].notes || null,
    }));

    const requestBody = { details };

    console.log('Request Body:', JSON.stringify(requestBody, null, 2));

    try {
      const response = await createInventoryReport(id as string, requestBody);

      if (response.statusCode === 200) {
        router.push({
          pathname: '/(warehouse)/(tabs)/reported/[id]',
          params: { id },
        });
      } else {
        setSnackbarMessage('Submission was successful, but an error occurred.');
        setSnackbarVisible(true);
      }
    } catch (error) {
      setSnackbarMessage('Failed to submit the report.');
      setSnackbarVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSuccess) return null;

  return (
    <View style={styles.container}>
      <AppbarHeader title='Create Inventory Report' />
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Header */}
        <HeaderCard
          code={data?.data.code}
          status={data?.data.status}
          createdAt={data?.data.createdAt}
          warehouseManager={data?.data?.warehouseManager}
        />
        {/* Warehouse information */}
        <TeamCard warehouseStaff={data?.data.warehouseStaff} />
        <Divider />
        {/* Packages List */}
        <PackagesList
          inventoryReportDetail={data?.data?.inventoryReportDetail}
        />
      </ScrollView>
      <View style={styles.footer}>
        <Button
          icon='send'
          mode='contained'
          onPress={handleSubmit}
          buttonColor={Theme.primaryLightBackgroundColor}
          disabled={!allInputsValid || isSubmitting}
          labelStyle={styles.buttonLabel}
          style={[
            styles.submitButton,
            (!allInputsValid || isSubmitting) && styles.disabledButton,
          ]}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        className='bg-red-500 rounded-lg'
      >
        <Text className='text-white font-bold'>{snackbarMessage}</Text>
      </Snackbar>
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
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  submitButton: {
    borderRadius: 8,
  },
  buttonLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#d3d3d3',
  },
});

export default CreateInventoryReport;
