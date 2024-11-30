import StatusBadge from '@/components/common/StatusBadge';
import Theme from '@/constants/Theme';
import { NotepadText, CalendarDays } from 'lucide-react-native';
import React from 'react';
import { View, Text } from 'react-native';
import { Card, Divider, Button } from 'react-native-paper';
import { convertDate } from '@/helpers/converDate';

interface InventoryReportDetail {
  id: string;
  expectedQuantity: number;
  actualQuantity: number | null;
  managerQuantityConfirm: number | null;
  materialReceipt?: {
    id: string;
    code: string;
    expireDate?: string;
    importDate?: string;
    status: string;
  };
  productReceipt?: {
    id: string;
    code: string;
    expireDate?: string;
    importDate?: string;
    status: string;
  };
}

interface PackagesItemProps {
  details: InventoryReportDetail[];
}

const PackagesItem: React.FC<PackagesItemProps> = ({ details }) => {
  return (
    <View className='bg-gray-100'>
      {details.map((detail, index) => (
        <Card
          key={index}
          className='mb-4 rounded-xl shadow-lg bg-white border border-gray-200'
        >
          <Card.Content>
            {/* Render Receipt Header */}
            <View className='flex flex-row items-center justify-between mb-4'>
              <Text className='text-lg font-bold text-blue-700'>
                {detail.materialReceipt
                  ? `Material Receipt:`
                  : `Product Receipt:`}
              </Text>
              <StatusBadge>
                {detail.materialReceipt
                  ? detail.materialReceipt.code
                  : detail.productReceipt?.code || 'N/A'}
              </StatusBadge>
            </View>
            <Divider className='mb-4' />

            {/* Render Quantity Details */}
            <View className='mb-4'>
              <View className='flex-row items-center gap-2'>
                <NotepadText size={20} color={Theme.greyText} />
                <Text className='text-sm text-gray-700'>
                  <Text className='font-semibold'>Expected Quantity:</Text>{' '}
                  {detail.expectedQuantity}
                </Text>
              </View>
              {detail.actualQuantity !== null && (
                <View className='flex-row items-center gap-2 mt-2'>
                  <NotepadText size={20} color={Theme.greyText} />
                  <Text className='text-sm text-gray-700'>
                    <Text className='font-semibold'>Actual Quantity:</Text>{' '}
                    {detail.actualQuantity}
                  </Text>
                </View>
              )}
            </View>

            <Divider className='mb-4' />

            {/* Render Material Receipt Information */}
            {detail.materialReceipt && (
              <View className='mb-4'>
                <View className='flex-row items-center gap-2'>
                  <CalendarDays size={20} color={Theme.greyText} />
                  <Text className='text-sm text-gray-700'>
                    <Text className='font-semibold'>Expire Date:</Text>{' '}
                    {convertDate(detail.materialReceipt.expireDate)}
                  </Text>
                </View>
                <View className='flex-row items-center gap-2 mt-2'>
                  <CalendarDays size={20} color={Theme.greyText} />
                  <Text className='text-sm text-gray-700'>
                    <Text className='font-semibold'>Import Date:</Text>{' '}
                    {convertDate(detail.materialReceipt.importDate)}
                  </Text>
                </View>
                <Divider className='my-4' />
              </View>
            )}

            {/* Render Product Receipt Information */}
            {detail.productReceipt && (
              <View>
                <View className='flex-row items-center gap-2'>
                  <CalendarDays size={20} color={Theme.greyText} />
                  <Text className='text-sm text-gray-700'>
                    <Text className='font-semibold'>Expire Date:</Text>{' '}
                    {convertDate(detail.productReceipt.expireDate)}
                  </Text>
                </View>
                <View className='flex-row items-center gap-2 mt-2'>
                  <CalendarDays size={20} color={Theme.greyText} />
                  <Text className='text-sm text-gray-700'>
                    <Text className='font-semibold'>Import Date:</Text>{' '}
                    {convertDate(detail.productReceipt.importDate)}
                  </Text>
                </View>
                <Divider className='my-4' />
              </View>
            )}

            {/* Render Open Button */}
            <Button
              mode='contained'
              onPress={() => console.log('Open Button Pressed')}
              className='bg-blue-600 '
            >
              Open
            </Button>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
};

export default PackagesItem;
