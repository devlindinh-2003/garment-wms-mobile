import React from 'react';
import { ScrollView, View, Image } from 'react-native';
import { Text, Card, TextInput } from 'react-native-paper';
import { useGetInventoryReporttById } from '@/hooks/useGetInventoryReportById';
import { useLocalSearchParams } from 'expo-router';
import StatusBadge from '@/components/common/StatusBadge';
import Theme from '@/constants/Theme';
import AppbarHeader from '@/components/common/AppBarHeader';
import {
  Box,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Info,
  User,
  Users,
} from 'lucide-react-native';

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
    warehouseStaff,
    inventoryReportDetail,
  } = data.data;

  return (
    <ScrollView className='flex-1 bg-gray-50'>
      <AppbarHeader title='View report details' />
      <View className='p-4 space-y-6'>
        {/* Report Header */}
        <Card className='bg-white rounded-lg shadow-sm'>
          <Card.Content>
            <View className='flex-row justify-between items-center'>
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
            </View>
          </Card.Content>
        </Card>

        {/* General Information */}
        <Card
          className='bg-white rounded-lg shadow-md'
          style={{
            borderColor: '#e2e8f0',
          }}
        >
          <Card.Content className='space-y-6 p-6'>
            {/* Header */}
            <View className='flex-row items-center space-x-2 mb-4'>
              <Text className='text-xl font-bold text-primaryLight'>
                General Information
              </Text>
            </View>

            {/* Total Expected Quantity */}
            <View className='flex-row justify-between items-center'>
              <View className='flex-row items-center space-x-2'>
                <Box size={20} color='#64748b' />
                <Text className='text-base text-gray-700 font-medium'>
                  Total Expected Quantity:
                </Text>
              </View>
              <Text className='text-lg font-semibold text-gray-900'>
                {totalExpectedQuantity ?? 'N/A'}
              </Text>
            </View>

            {/* Total Actual Quantity */}
            <View className='flex-row justify-between items-center'>
              <View className='flex-row items-center space-x-2'>
                <CheckCircle size={20} color='#10b981' />
                <Text className='text-base text-gray-700 font-medium'>
                  Total Actual Quantity:
                </Text>
              </View>
              <Text className='text-lg font-semibold text-green-500'>
                {totalActualQuantity ?? 'N/A'}
              </Text>
            </View>

            {/* Warehouse Manager */}
            <View className='flex-row justify-between items-center'>
              <View className='flex-row items-center space-x-2'>
                <User size={20} color='#3b82f6' />
                <Text className='text-base text-gray-700 font-medium'>
                  Warehouse Manager:
                </Text>
              </View>
              <Text className='text-base text-gray-900'>
                {warehouseManager?.account?.firstName ?? 'N/A'}{' '}
                {warehouseManager?.account?.lastName ?? ''}
              </Text>
            </View>

            {/* Warehouse Staff */}
            <View className='flex-row justify-between items-center'>
              <View className='flex-row items-center space-x-2'>
                <Users size={20} color='#22c55e' />
                <Text className='text-base text-gray-700 font-medium'>
                  Warehouse Staff:
                </Text>
              </View>
              <Text className='text-base text-gray-900'>
                {warehouseStaff?.account?.firstName ?? 'N/A'}{' '}
                {warehouseStaff?.account?.lastName ?? ''}
              </Text>
            </View>

            {/* Note */}
            <View className='mt-4'>
              <View className='flex-row items-center space-x-2 mb-2'>
                <FileText size={20} color='#64748b' />
                <Text className='text-base text-gray-700 font-medium'>
                  Note:
                </Text>
              </View>
              <TextInput
                className='h-24 text-base'
                mode='outlined'
                value={note || 'No note provided'}
                editable={false}
                style={{
                  backgroundColor: '#f9fafb',
                }}
                theme={{
                  colors: {
                    text: '#1f2937',
                    disabled: '#6b7280',
                  },
                }}
              />
            </View>
          </Card.Content>
        </Card>

        <Card
          className='bg-white rounded-lg shadow-md'
          style={{
            borderColor: '#e2e8f0',
          }}
        >
          <Card.Content className='space-y-6 p-6'>
            {/* Header */}
            <View className='flex-row items-center space-x-2 mb-4'>
              <Text className='text-xl font-bold text-primaryLight'>
                Inventory Report Details
              </Text>
            </View>

            {/* Inventory Report Details */}
            {inventoryReportDetail?.map((detail: any) => (
              <Card
                key={detail.materialVariant?.id || detail.productVariant?.id}
                style={{
                  backgroundColor: Theme.blue[50],
                  borderWidth: 1,
                  borderColor: '#e0e0e0',
                  marginBottom: 16,
                }}
              >
                <Card.Content>
                  {/* Variant or Size Details */}
                  <View className='flex-row items-center'>
                    <Image
                      source={{
                        uri:
                          detail.materialVariant?.image ||
                          detail.productVariant?.image ||
                          'https://via.placeholder.com/60',
                      }}
                      style={{ width: 60, height: 60, borderRadius: 8 }}
                    />
                    <View className='ml-4 flex-1'>
                      <Text className='text-base font-bold text-gray-800'>
                        {detail.materialVariant?.name ||
                          detail.productVariant?.name ||
                          'No Name'}
                      </Text>
                      <Text className='text-sm text-gray-600'>
                        Code:{' '}
                        {detail.materialVariant?.code ||
                          detail.productVariant?.code ||
                          'N/A'}
                      </Text>
                    </View>
                  </View>

                  {/* Material Packages */}
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
                              borderLeftColor:
                                Theme.primaryLightBackgroundColor,
                            }}
                          >
                            <Text className='text-sm text-gray-600'>
                              <Text className='font-medium'>Receipt Code:</Text>{' '}
                              <Text className='font-bold text-black'>
                                {reportDetail?.materialReceipt?.code || 'N/A'}
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
                              <Text className='font-medium'>
                                Actual Quantity:
                              </Text>{' '}
                              <Text className='font-bold text-green-500'>
                                {reportDetail?.actualQuantity ?? 'N/A'}
                              </Text>
                            </Text>
                          </View>
                        )
                      )}
                    </View>
                  ))}

                  {/* Product Sizes */}
                  {detail.productSizes?.map((productSize: any) => (
                    <View
                      key={productSize.productSize?.id}
                      style={{ marginTop: 16 }}
                    >
                      <Text className='text-base font-semibold text-gray-600 mb-1'>
                        Product :{' '}
                        <Text className='text-primaryLight font-bold'>
                          {productSize.productSize?.name ??
                            'Unnamed Product Size'}
                        </Text>
                      </Text>

                      {productSize.inventoryReportDetails?.map(
                        (reportDetail: any) => (
                          <View
                            key={reportDetail.id}
                            style={{
                              marginTop: 8,
                              paddingLeft: 12,
                              borderLeftWidth: 2,
                              borderLeftColor:
                                Theme.primaryLightBackgroundColor,
                            }}
                          >
                            <Text className='text-sm text-gray-600'>
                              <Text className='font-medium'>Receipt Code:</Text>{' '}
                              <Text className='font-bold text-black'>
                                {reportDetail?.productReceipt?.code || 'N/A'}
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
                              <Text className='font-medium'>
                                Actual Quantity:
                              </Text>{' '}
                              <Text className='font-bold text-green-500'>
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
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

export default ReportedInventoryReport;
