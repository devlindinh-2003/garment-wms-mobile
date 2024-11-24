import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image } from 'react-native';
import { Text, Card, Button, TextInput, Snackbar } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import StatusBadge from '@/components/common/StatusBadge';
import Theme from '@/constants/Theme';
import { createInventoryReport } from '@/api/inventoryReport';
import { useGetInventoryReporttById } from '@/hooks/useGetInventoryReportById';

const CreateInventoryReport = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data, isSuccess, isPending } = useGetInventoryReporttById(
    id as string
  );

  const [inputs, setInputs] = useState<any>({});
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isSuccess && data?.data?.inventoryReportDetail) {
      const initialInputs: any = {};
      data.data.inventoryReportDetail.forEach((detail: any) => {
        detail.materialPackages.forEach((materialPackage: any) => {
          materialPackage.inventoryReportDetails.forEach(
            (inventoryDetail: any) => {
              initialInputs[inventoryDetail.id] = {
                actualQuantity: '',
                notes: '',
                isValid: false,
              };
            }
          );
        });
      });
      setInputs(initialInputs);
    }
  }, [isSuccess, data]);

  const handleInputChange = (id: string, field: string, value: any) => {
    setInputs((prevInputs: any) => {
      const updatedInputs = {
        ...prevInputs,
        [id]: {
          ...prevInputs[id],
          [field]: value,
        },
      };
      // Check validity
      const actualQuantity = updatedInputs[id]?.actualQuantity;
      updatedInputs[id].isValid =
        actualQuantity !== '' && !isNaN(parseInt(actualQuantity, 10));
      return updatedInputs;
    });
  };

  const allInputsValid = Object.values(inputs).every(
    (input: any) => input.isValid
  );

  const handleSubmit = async () => {
    if (!allInputsValid) {
      setSnackbarMessage('Please fill in all fields and fix errors.');
      setSnackbarVisible(true);
      return;
    }

    setIsSubmitting(true);

    const details = Object.keys(inputs).map((id) => ({
      inventoryReportDetailId: id,
      actualQuantity: parseInt(inputs[id].actualQuantity, 10),
      note: inputs[id].notes || null,
    }));

    const requestBody = { details };

    console.log(
      'Generated Request Body:',
      JSON.stringify(requestBody, null, 2)
    );

    try {
      const response = await createInventoryReport(id as string, requestBody);
      console.log('API Response:', JSON.stringify(response, null, 2));

      if (response.statusCode === 200) {
        router.push({
          pathname: '/(warehouse)/(tabs)/reported/[id]',
          params: { id: id },
        });
      } else {
        setSnackbarMessage('Submission was successful, but an error occurred.');
        setSnackbarVisible(true);
      }
    } catch (error: any) {
      console.error('Error submitting report:', error.message);
      setSnackbarMessage('Failed to submit the report.');
      setSnackbarVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <View className='flex-1 justify-center items-center bg-gray-100'>
        <Text className='text-lg font-semibold text-gray-600'>Loading...</Text>
      </View>
    );
  }

  if (!isSuccess || !data?.data) {
    return (
      <View className='flex-1 justify-center items-center bg-gray-100'>
        <Text className='text-lg font-semibold text-red-500'>
          Failed to load inventory report data.
        </Text>
      </View>
    );
  }

  const { code, status, inventoryReportDetail } = data.data;

  return (
    <>
      <ScrollView className='flex-1 bg-gray-50'>
        <View className='p-4 space-y-6'>
          {/* Report Header */}
          <Card className='bg-white rounded-lg shadow-sm'>
            <Card.Content className='flex-row justify-between items-center'>
              <View>
                <Text className='text-xl font-bold text-gray-800'>
                  Inventory Report:
                </Text>
                <StatusBadge className='text-xl font-bold text-blue-600'>
                  {code}
                </StatusBadge>
              </View>
              <StatusBadge variant={status.toLowerCase()}>{status}</StatusBadge>
            </Card.Content>
          </Card>

          {/* Report Details */}
          <View>
            <Text className='text-lg font-bold text-gray-800 mb-3'>
              Inventory Report Details
            </Text>
            {inventoryReportDetail.map((detail: any) =>
              detail.materialPackages.map((materialPackage: any) => (
                <Card
                  key={materialPackage.materialPackage.id}
                  className='mb-4 rounded-lg shadow-md overflow-hidden'
                  style={{
                    backgroundColor: Theme.secondaryBackgroundColor,
                    borderWidth: 1,
                    borderColor: Theme.borderColor || '#e0e0e0',
                  }}
                >
                  <Card.Content className='space-y-4 p-4'>
                    {/* Material Package Info */}
                    <View className='flex-row items-center mb-4'>
                      <Image
                        source={{ uri: detail.materialVariant?.image }}
                        style={{ width: 60, height: 60, borderRadius: 8 }}
                      />
                      <View className='ml-4 flex-1'>
                        <Text className='text-sm text-gray-600 font-medium'>
                          Package Name:
                        </Text>
                        <Text className='text-base text-black font-bold'>
                          {materialPackage.materialPackage.name}
                        </Text>
                        <Text className='text-sm text-gray-600'>
                          Code:{' '}
                          <Text className='text-primaryLight font-semibold'>
                            {materialPackage?.materialPackage.code}
                          </Text>
                        </Text>
                      </View>
                    </View>

                    {/* Inventory Report Details */}
                    {materialPackage.inventoryReportDetails.map(
                      (inventoryDetail: any) => (
                        <View
                          key={inventoryDetail.id}
                          className='p-4 rounded-md bg-white shadow-sm border mb-3'
                        >
                          <Text className='text-sm text-gray-600'>
                            Expected Quantity:{' '}
                            <Text className='font-bold'>
                              {inventoryDetail.expectedQuantity}
                            </Text>
                          </Text>
                          <Text className='text-sm text-gray-600'>
                            Receipt Code:{' '}
                            <Text className='text-primaryLight font-bold'>
                              {inventoryDetail.materialReceipt?.code || 'N/A'}
                            </Text>
                          </Text>
                          <View className='mt-2'>
                            <Text className='text-sm text-gray-600 font-medium mb-1'>
                              Enter Actual Quantity:
                            </Text>
                            <TextInput
                              outlineColor={Theme.primaryDarkBackgroundColor}
                              activeOutlineColor={
                                Theme.primaryLightBackgroundColor
                              }
                              mode='outlined'
                              placeholder='Enter actual quantity'
                              value={
                                inputs[inventoryDetail.id]?.actualQuantity || ''
                              }
                              onChangeText={(value: string) =>
                                handleInputChange(
                                  inventoryDetail.id,
                                  'actualQuantity',
                                  value
                                )
                              }
                              keyboardType='numeric'
                              style={{ backgroundColor: 'white' }}
                            />
                          </View>
                          <View className='mt-2'>
                            <Text className='text-sm text-gray-600 font-medium mb-1'>
                              Notes:
                            </Text>
                            <TextInput
                              outlineColor={Theme.primaryDarkBackgroundColor}
                              activeOutlineColor={
                                Theme.primaryLightBackgroundColor
                              }
                              mode='outlined'
                              placeholder='Enter notes'
                              value={inputs[inventoryDetail.id]?.notes || ''}
                              onChangeText={(value: string) =>
                                handleInputChange(
                                  inventoryDetail.id,
                                  'notes',
                                  value
                                )
                              }
                              style={{ backgroundColor: 'white' }}
                            />
                          </View>
                        </View>
                      )
                    )}
                  </Card.Content>
                </Card>
              ))
            )}
          </View>

          {/* Submit Button */}
          <Button
            icon='send'
            mode='contained'
            onPress={handleSubmit}
            disabled={!allInputsValid || isSubmitting}
            style={{
              backgroundColor: !allInputsValid
                ? Theme.greyText
                : Theme.primaryLightBackgroundColor,
              borderRadius: 8,
              marginTop: 16,
            }}
            labelStyle={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}
            contentStyle={{ height: 50 }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </View>
      </ScrollView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{
          backgroundColor: Theme.error,
          borderRadius: 6,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          {snackbarMessage}
        </Text>
      </Snackbar>
    </>
  );
};

export default CreateInventoryReport;
