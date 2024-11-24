import React from 'react';
import { ScrollView, View, Image } from 'react-native';
import { Text, Card, Divider } from 'react-native-paper';
import { useGetInventoryReporttById } from '@/hooks/useGetInventoryReportById';
import { useLocalSearchParams } from 'expo-router';
import StatusBadge from '@/components/common/StatusBadge';
import Theme from '@/constants/Theme';

const ReportedInventoryReport = () => {
  const { id } = useLocalSearchParams();
  const { data, isSuccess, isPending } = useGetInventoryReporttById(
    id as string
  );

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
    note,
    totalExpectedQuantity,
    totalActualQuantity,
    warehouseManager,
    inventoryReportDetail,
  } = data.data;

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
            <StatusBadge
              variant={status.toLowerCase()}
              className='bg-green-500'
            >
              {status}
            </StatusBadge>
          </Card.Content>
        </Card>

        {/* General Information */}
        <Card
          style={{
            borderColor: Theme.borderColor || '#e0e0e0',
          }}
        >
          <Card.Content className='space-y-2'>
            <Text className='text-lg font-bold text-gray-800 mb-2'>
              General Information
            </Text>
            <Text className='text-sm text-gray-600'>
              <Text className='font-medium'>Note:</Text>{' '}
              {note || 'No note provided'}
            </Text>
            <Text className='text-sm text-gray-600'>
              <Text className='font-medium'>Total Expected Quantity:</Text>{' '}
              {totalExpectedQuantity ?? 'N/A'}
            </Text>
            <Text className='text-sm text-gray-600'>
              <Text className='font-medium'>Total Actual Quantity:</Text>{' '}
              {totalActualQuantity ?? 'N/A'}
            </Text>
            <Text className='text-sm text-gray-600'>
              <Text className='font-medium'>Warehouse Manager:</Text>{' '}
              {warehouseManager?.account?.firstName ?? 'N/A'}{' '}
              {warehouseManager?.account?.lastName ?? ''}
            </Text>
          </Card.Content>
        </Card>

        {/* Inventory Report Details */}
        {inventoryReportDetail?.map((detail: any) => (
          <Card
            key={detail.productVariant?.id}
            style={{
              backgroundColor: Theme.blue[50],
              borderWidth: 1,
              borderColor: Theme.borderColor || '#e0e0e0',
            }}
          >
            <Card.Content className='space-y-4'>
              <View className='flex-row items-center'>
                <Image
                  source={{ uri: detail.productVariant?.image }}
                  style={{ width: 60, height: 60, borderRadius: 8 }}
                />
                <View className='ml-4 flex-1'>
                  <Text className='text-base font-bold text-gray-800'>
                    {detail.productVariant?.name ?? 'No Name'}
                  </Text>
                  <Text className='text-sm text-gray-600'>
                    Code: {detail.productVariant?.code ?? 'N/A'}
                  </Text>
                </View>
              </View>

              {/* Sizes and Details */}
              {detail.productSizes?.map((size: any) => (
                <View key={size.productSize?.id} className='mt-2'>
                  <Text className='text-base font-semibold text-blue-600 mb-1'>
                    {size.productSize?.name ?? 'Unnamed Size'}
                  </Text>
                  {size.inventoryReportDetails?.map((reportDetail: any) => (
                    <View key={reportDetail.id} className='ml-4 space-y-1'>
                      <Text className='text-sm text-gray-600'>
                        <Text className='font-medium'>Expected Quantity:</Text>{' '}
                        {reportDetail?.expectedQuantity ?? 'N/A'}
                      </Text>
                      <Text className='text-sm text-gray-600'>
                        <Text className='font-medium'>Actual Quantity:</Text>{' '}
                        {reportDetail?.actualQuantity ?? 'N/A'}
                      </Text>
                      <Text className='text-sm text-gray-600'>
                        <Text className='font-medium'>Product Receipt:</Text>{' '}
                        {reportDetail?.productReceipt?.code ?? 'N/A'}
                      </Text>
                      <Divider className='my-2' />
                    </View>
                  ))}
                </View>
              ))}
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

export default ReportedInventoryReport;
