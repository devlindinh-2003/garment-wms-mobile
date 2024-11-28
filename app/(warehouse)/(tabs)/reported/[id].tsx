import React from 'react';
import { ScrollView, View, Image } from 'react-native';
import { Text, Card, Divider } from 'react-native-paper';
import { useGetInventoryReporttById } from '@/hooks/useGetInventoryReportById';
import { useLocalSearchParams } from 'expo-router';
import StatusBadge from '@/components/common/StatusBadge';
import Theme from '@/constants/Theme';
import AppbarHeader from '@/components/common/AppBarHeader';

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
      <AppbarHeader title='View report details' />
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
          className='bg-slate-300'
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
            key={detail.materialVariant?.id}
            style={{
              backgroundColor: Theme.blue[50],
              borderWidth: 1,
              borderColor: Theme.borderColor || '#e0e0e0',
              marginBottom: 16,
            }}
          >
            <Card.Content>
              {/* Material Variant Details */}
              <View className='flex-row items-center'>
                <Image
                  source={{ uri: detail.materialVariant?.image }}
                  style={{ width: 60, height: 60, borderRadius: 8 }}
                />
                <View className='ml-4 flex-1'>
                  <Text className='text-base font-bold text-gray-800'>
                    {detail.materialVariant?.name ?? 'No Name'}
                  </Text>
                  <Text className='text-sm text-gray-600'>
                    Code: {detail.materialVariant?.code ?? 'N/A'}
                  </Text>
                </View>
              </View>

              {/* Material Packages and Inventory Details */}
              {detail.materialPackages?.map((materialPackage: any) => (
                <View
                  key={materialPackage.materialPackage?.id}
                  style={{ marginTop: 16 }}
                >
                  <Text className='text-base font-semibold text-gray-600 mb-1'>
                    Package:{' '}
                    <Text className='text-primaryLight font-bold'>
                      {materialPackage.materialPackage?.name ??
                        'Unnamed Package'}
                    </Text>
                  </Text>

                  {materialPackage.inventoryReportDetails?.map(
                    (reportDetail: any) => (
                      <View
                        key={reportDetail.id}
                        style={{
                          marginTop: 8,
                          paddingLeft: 12,
                          borderLeftWidth: 2,
                          borderLeftColor: Theme.primaryLightBackgroundColor,
                        }}
                      >
                        <Text className='text-sm text-gray-600'>
                          <Text className='font-medium'>Receipt Code:</Text>{' '}
                          <Text className='font-bold text-black'>
                            {reportDetail?.materialReceipt?.code ?? 'N/A'}
                          </Text>
                        </Text>
                        <Text className='text-sm text-gray-600'>
                          <Text className='font-medium'>
                            Expected Quantity:
                          </Text>{' '}
                          <Text className='font-bold text-red-500'>
                            {reportDetail?.expectedQuantity ?? 'N/A'}
                          </Text>
                        </Text>
                        <Text className='text-sm text-gray-600'>
                          <Text className='font-medium'>Actual Quantity:</Text>{' '}
                          <Text className='font-bold text-green-500'>
                            {' '}
                            {reportDetail?.actualQuantity ?? 'N/A'}
                          </Text>
                        </Text>
                      </View>
                    )
                  )}
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
