import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image } from 'react-native';
import { Text, Card, Button, TextInput } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { useGetInventoryReporttById } from '@/hooks/useGetInventoryReportById';
import StatusBadge from '@/components/common/StatusBadge';
import Theme from '@/constants/Theme';
import { createInventoryReport } from '@/api/inventoryReport';

const CreateInventoryReport = () => {
  const { id } = useLocalSearchParams();
  const { data, isSuccess, isPending } = useGetInventoryReporttById(
    id as string
  );

  const [inputs, setInputs] = useState<any>({});

  // Initialize inputs based on API response
  useEffect(() => {
    if (isSuccess && data?.data?.inventoryReportDetail) {
      const initialInputs: any = {};
      data.data.inventoryReportDetail.forEach((detail: any) => {
        detail.materialPackages.forEach((materialPackage: any) => {
          materialPackage.inventoryReportDetails.forEach(
            (inventoryDetail: any) => {
              initialInputs[inventoryDetail.id] = {
                actualQuantity: '', // Input by user
                notes: '', // Input by user
              };
            }
          );
        });
      });
      setInputs(initialInputs);
    }
  }, [isSuccess, data]);

  // Handle input change
  const handleInputChange = (id: string, field: string, value: any) => {
    setInputs((prevInputs: any) => ({
      ...prevInputs,
      [id]: {
        ...prevInputs[id],
        [field]: value,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    const details = Object.keys(inputs)
      .filter((key) => inputs[key].actualQuantity || inputs[key].notes)
      .map((id) => ({
        inventoryReportDetailId: id,
        actualQuantity: inputs[id].actualQuantity
          ? parseInt(inputs[id].actualQuantity, 10)
          : null, // Ensure numeric or null
        note: inputs[id].notes || null, // Ensure string or null
      }));

    if (!details.length) {
      alert('Please fill in at least one detail to submit.');
      return;
    }

    const requestBody = { details };

    console.log(
      'Generated Request Body:',
      JSON.stringify(requestBody, null, 2)
    );

    // Uncomment the following lines to send the request
    try {
      const response = await createInventoryReport(id as string, requestBody);
      console.log('API Response:', JSON.stringify(response, null, 2));
      alert('Inventory report submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting report:', error.message);
      alert('Failed to submit inventory report. Please try again.');
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
    <ScrollView className='flex-1 bg-gray-50'>
      <View className='p-4 space-y-6'>
        {/* Report Header */}
        <View className='bg-white rounded-lg shadow-sm p-4 flex flex-row items-center justify-between'>
          <Text className='text-xl font-bold text-gray-800 mb-2'>
            Inventory Report: <Text className='text-blue-600'>{code}</Text>
          </Text>
          <View className='flex-row items-center'>
            <StatusBadge variant={status.toLowerCase()}>{status}</StatusBadge>
          </View>
        </View>

        {/* Report Details */}
        <View>
          <Text className='text-lg font-bold text-gray-800 mb-3'>
            Inventory Report Details
          </Text>
          {inventoryReportDetail.map((detail: any) =>
            detail.materialPackages.map((materialPackage: any) =>
              materialPackage.inventoryReportDetails.map(
                (inventoryDetail: any) => (
                  <Card
                    key={inventoryDetail.id}
                    className='mb-4 rounded-lg shadow-md overflow-hidden'
                  >
                    <Card.Content className='space-y-4'>
                      {/* Material Variant */}
                      <View className='flex-row items-center mb-4'>
                        <Image
                          source={{ uri: detail.materialVariant?.image }}
                          style={{ width: 50, height: 50, borderRadius: 8 }}
                        />
                        <View className='ml-4'>
                          <Text className='text-sm text-gray-600 font-medium'>
                            Material Variant:{' '}
                            <Text className='text-black font-bold'>
                              {detail.materialVariant?.name}
                            </Text>
                          </Text>
                          <Text className='text-sm text-gray-600'>
                            Code:{' '}
                            <Text className='text-black'>
                              {detail.materialVariant?.code}
                            </Text>
                          </Text>
                        </View>
                      </View>

                      {/* Input Fields */}
                      <View>
                        <Text className='text-sm text-gray-600 font-medium'>
                          Actual Quantity:
                        </Text>
                        <TextInput
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
                          className='mt-2'
                          style={{ backgroundColor: 'white' }}
                        />
                      </View>
                      <View className='mt-4'>
                        <Text className='text-sm text-gray-600 font-medium'>
                          Notes:
                        </Text>
                        <TextInput
                          placeholder='Enter notes'
                          value={inputs[inventoryDetail.id]?.notes || ''}
                          onChangeText={(value: string) =>
                            handleInputChange(
                              inventoryDetail.id,
                              'notes',
                              value
                            )
                          }
                          numberOfLines={3}
                          multiline
                          className='mt-2'
                          style={{ backgroundColor: 'white' }}
                        />
                      </View>
                    </Card.Content>
                  </Card>
                )
              )
            )
          )}
        </View>

        {/* Submit Button */}
        <Button
          icon='send'
          mode='contained'
          buttonColor={Theme.primaryLightBackgroundColor}
          labelStyle={{ color: 'white', fontWeight: 'bold' }}
          onPress={handleSubmit}
        >
          Submit Report
        </Button>
      </View>
    </ScrollView>
  );
};

export default CreateInventoryReport;
