import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image } from 'react-native';
import { Text, Card, Button, TextInput, Snackbar } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import StatusBadge from '@/components/common/StatusBadge';
import Theme from '@/constants/Theme';
import { createInventoryReport } from '@/api/inventoryReport';
import { useGetInventoryReporttById } from '@/hooks/useGetInventoryReportById';
import { convertDate } from '../../../../helpers/converDate';
import { Calendar } from 'lucide-react-native';
import avatar from '@/assets/images/avatar.png';
import AppbarHeader from '@/components/common/AppBarHeader';

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
      updatedInputs[id].isValid =
        updatedInputs[id]?.actualQuantity !== '' &&
        !isNaN(parseInt(updatedInputs[id].actualQuantity, 10));
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

    try {
      const response = await createInventoryReport(id as string, requestBody);

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

  const {
    code,
    status,
    inventoryReportDetail,
    warehouseManager,
    warehouseStaff,
    note,
    createdAt,
  } = data.data;

  return (
    <ScrollView className='flex-1 bg-gray-50'>
      <AppbarHeader title='Create Inventory Report' />
      <View className='p-4 space-y-6'>
        {/* Report Header */}
        <Card className='bg-white rounded-lg shadow-md border border-gray-200'>
          <Card.Content className='p-4 space-y-4'>
            {/* Title and Status */}
            <View className='flex flex-row justify-between items-center'>
              <Text className='text-xl font-bold text-primaryLight'>
                Inventory Report
              </Text>
              <StatusBadge className='bg-primaryLight'>
                {status.replace('_', ' ')}
              </StatusBadge>
            </View>

            {/* Code */}
            <View className='bg-gray-100 rounded-md p-2'>
              <Text className='text-sm font-semibold text-gray-700'>Code:</Text>
              <Text className='text-lg font-bold text-gray-800'>{code}</Text>
            </View>

            {/* Created At */}
            <View className='flex flex-row items-center space-x-2'>
              <Calendar color={Theme.greyText} size={17} />
              <Text className='text-sm text-gray-500'>
                Created At:{' '}
                <Text className='font-bold text-gray-700'>
                  {convertDate(createdAt)}
                </Text>
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Manager and Staff Info */}
        <Card className='bg-white rounded-lg shadow-md border border-gray-200'>
          <Card.Content className='p-4 space-y-4'>
            <Text className='text-lg font-bold text-gray-800'>
              Warehouse Team
            </Text>
            <View className='flex-row items-center'>
              <View className='ml-4'>
                <Text className='text-sm font-bold text-gray-800'>
                  Manager: {warehouseManager.account.firstName}{' '}
                  {warehouseManager.account.lastName}
                </Text>
                <Text className='text-sm text-gray-600'>
                  Email: {warehouseManager.account.email}
                </Text>
                <Text className='text-sm text-gray-600'>
                  Phone: {warehouseManager.account.phoneNumber}
                </Text>
              </View>
            </View>
            <View className='flex-row items-center'>
              <View className='ml-4'>
                <Text className='text-sm font-bold text-gray-800'>
                  Staff: {warehouseStaff.account.firstName}{' '}
                  {warehouseStaff.account.lastName}
                </Text>
                <Text className='text-sm text-gray-600'>
                  Email: {warehouseStaff.account.email}
                </Text>
                <Text className='text-sm text-gray-600'>
                  Phone: {warehouseStaff.account.phoneNumber}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Material Variants */}
        <View>
          <Text className='text-xl uppercase font-bold text-blue-600 text-center mb-3'>
            Material Variants and Packages
          </Text>
          {inventoryReportDetail.map((detail: any) => (
            <Card
              key={detail.materialVariant.id}
              className='mb-6 rounded-lg shadow-lg bg-blue-50 border border-blue-200'
            >
              <Card.Content className='p-4'>
                {/* Material Variant Info */}
                <View className='flex-row items-center mb-4'>
                  <Image
                    source={{ uri: detail.materialVariant.image }}
                    className='w-16 h-16 rounded-lg'
                  />
                  <View className='ml-4'>
                    <Text className='text-lg font-bold text-gray-800'>
                      {detail.materialVariant.name}
                    </Text>
                    <Text className='text-sm text-gray-600'>
                      Code: {detail.materialVariant.code}
                    </Text>
                    <Text className='text-sm text-gray-600'>
                      Reorder Level: {detail.materialVariant.reorderLevel}
                    </Text>
                  </View>
                </View>

                {/* Material Packages */}
                {detail.materialPackages.map((materialPackage: any) => (
                  <Card
                    key={materialPackage.materialPackage.id}
                    className='mb-4 shadow-sm bg-white rounded-lg border border-gray-200'
                  >
                    <Card.Content className='p-3 space-y-2'>
                      <Text className='text-sm font-bold text-gray-700'>
                        {materialPackage.materialPackage.name}
                      </Text>
                      <Text className='text-xs text-gray-500'>
                        Code: {materialPackage.materialPackage.code}
                      </Text>

                      {/* Inventory Report Details */}
                      {materialPackage.inventoryReportDetails.map(
                        (inventoryDetail: any) => (
                          <View
                            key={inventoryDetail.id}
                            className='mt-2 bg-gray-50 p-3 rounded-lg border border-gray-300'
                          >
                            <Text className='text-sm text-gray-600'>
                              Expected Quantity:{' '}
                              <Text className='font-bold'>
                                {inventoryDetail.expectedQuantity}
                              </Text>
                            </Text>
                            <TextInput
                              mode='outlined'
                              placeholder='Actual Quantity'
                              value={
                                inputs[inventoryDetail.id]?.actualQuantity || ''
                              }
                              onChangeText={(value) =>
                                handleInputChange(
                                  inventoryDetail.id,
                                  'actualQuantity',
                                  value
                                )
                              }
                              className='mt-2'
                            />
                            <TextInput
                              mode='outlined'
                              placeholder='Notes'
                              value={inputs[inventoryDetail.id]?.notes || ''}
                              onChangeText={(value) =>
                                handleInputChange(
                                  inventoryDetail.id,
                                  'notes',
                                  value
                                )
                              }
                              className='mt-2'
                            />
                          </View>
                        )
                      )}
                    </Card.Content>
                  </Card>
                ))}
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Submit Button */}
        <Button
          mode='contained'
          onPress={handleSubmit}
          disabled={!allInputsValid || isSubmitting}
          className={`rounded-lg ${
            !allInputsValid ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </Button>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        className='bg-red-500 rounded-md'
      >
        <Text className='text-white font-bold'>{snackbarMessage}</Text>
      </Snackbar>
    </ScrollView>
  );
};

export default CreateInventoryReport;
