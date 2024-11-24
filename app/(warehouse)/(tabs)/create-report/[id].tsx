import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image } from 'react-native';
import { Text, Card, Button, TextInput } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetInventoryReporttById } from '@/hooks/useGetInventoryReportById';
import StatusBadge from '@/components/common/StatusBadge';
import Theme from '@/constants/Theme';
import { createInventoryReport } from '@/api/inventoryReport';

const CreateInventoryReport = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data, isSuccess, isPending } = useGetInventoryReporttById(
    id as string
  );

  const [inputs, setInputs] = useState<any>({});

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
              };
            }
          );
        });
      });
      setInputs(initialInputs);
    }
  }, [isSuccess, data]);

  const handleInputChange = (id: string, field: string, value: any) => {
    setInputs((prevInputs: any) => ({
      ...prevInputs,
      [id]: {
        ...prevInputs[id],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    const details = Object.keys(inputs)
      .filter((key) => inputs[key].actualQuantity || inputs[key].notes)
      .map((id) => ({
        inventoryReportDetailId: id,
        actualQuantity: inputs[id].actualQuantity
          ? parseInt(inputs[id].actualQuantity, 10)
          : null,
        note: inputs[id].notes || null,
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

    try {
      const response = await createInventoryReport(id as string, requestBody);
      console.log('API Response:', JSON.stringify(response, null, 2));

      if (response.statusCode === 200) {
        router.push({
          pathname: '/(warehouse)/(tabs)/reported/[id]',
          params: { id: id },
        });
      } else {
        alert('Submission was successful, but no report ID was returned.');
      }
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
        <Card className='bg-white rounded-lg shadow-sm'>
          <Card.Content className='flex-row justify-between items-center'>
            <View>
              <Text className='text-xl font-bold text-gray-800'>
                Inventory Report:
              </Text>
              <Text className='text-xl font-bold text-blue-600'>{code}</Text>
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
            detail.materialPackages.map((materialPackage: any) =>
              materialPackage.inventoryReportDetails.map(
                (inventoryDetail: any) => (
                  <Card
                    key={inventoryDetail.id}
                    className='mb-4 rounded-lg shadow-md overflow-hidden'
                    style={{
                      backgroundColor: Theme.cardBackgroundColor,
                      borderWidth: 1,
                      borderColor: Theme.borderColor || '#e0e0e0',
                    }}
                  >
                    <Card.Content className='space-y-4 p-4'>
                      {/* Material Variant */}
                      <View className='flex-row items-center mb-4'>
                        <Image
                          source={{ uri: detail.materialVariant?.image }}
                          style={{ width: 60, height: 60, borderRadius: 8 }}
                        />
                        <View className='ml-4 flex-1'>
                          <Text className='text-sm text-gray-600 font-medium'>
                            Material Variant:
                          </Text>
                          <Text className='text-base text-black font-bold'>
                            {detail.materialVariant?.name}
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
                        <Text className='text-sm text-gray-600 font-medium mb-1'>
                          Actual Quantity:
                        </Text>
                        <TextInput
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
                      <View className='mt-4'>
                        <Text className='text-sm text-gray-600 font-medium mb-1'>
                          Notes:
                        </Text>
                        <TextInput
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
                          multiline
                          numberOfLines={3}
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
          onPress={handleSubmit}
          style={{
            backgroundColor: Theme.primaryLightBackgroundColor,
            borderRadius: 8,
            marginTop: 16,
          }}
          labelStyle={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}
          contentStyle={{ height: 50 }}
        >
          Submit Report
        </Button>
      </View>
    </ScrollView>
  );
};

export default CreateInventoryReport;
