import AppbarHeader from '@/components/common/AppBarHeader';
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useGetDetailByReceipt } from '@/hooks/useGetDetailByReceipt';
import SpinnerLoading from '@/components/common/SpinnerLoading';
import { Card, Text, Button, TextInput } from 'react-native-paper';
import StatusBadge from '@/components/common/StatusBadge';
import { convertDate } from '../../../helpers/converDate';
import { CalendarDays, CalendarX } from 'lucide-react-native';

interface PackagesDetailProps {
  closeModal: () => void;
  receiptCode: string | null;
  receiptType: 'material' | 'product';
}

const PackagesDetail: React.FC<PackagesDetailProps> = ({
  closeModal,
  receiptCode,
  receiptType,
}) => {
  const { itemReceipt, isPending, isError, error } = useGetDetailByReceipt(
    receiptCode || '',
    receiptType
  );

  const [actualQuantity, setActualQuantity] = useState('');

  const handleSave = () => {
    console.log('Save button clicked');
    console.log('Actual Quantity:', actualQuantity);
    // Add your save functionality here
  };

  return (
    <View className='flex-1 bg-white'>
      <AppbarHeader title={receiptCode || 'Loading...'} onPress={closeModal} />
      <View className='p-4 flex-1'>
        {isPending && <SpinnerLoading />}
        {isError && (
          <Text className='text-red-500 text-center'>
            Error: {error?.message || 'Failed to load details.'}
          </Text>
        )}
        {itemReceipt && (
          <ScrollView>
            <Card className='rounded-lg shadow-lg bg-white mb-4'>
              {/* Image Section */}
              {(receiptType === 'material' &&
                itemReceipt.materialPackage?.materialVariant?.image) ||
              (receiptType === 'product' &&
                itemReceipt.productSize?.productVariant?.image) ? (
                <Card.Cover
                  source={{
                    uri:
                      receiptType === 'material'
                        ? itemReceipt.materialPackage?.materialVariant?.image
                        : itemReceipt.productSize?.productVariant?.image,
                  }}
                  className='h-48'
                />
              ) : null}

              <Card.Content>
                {/* Name and Code in Justified Layout */}
                <View className='flex-row justify-between items-center mb-2 gap-3'>
                  <Text className='text-xl font-bold text-gray-800 flex-1'>
                    {receiptType === 'material'
                      ? itemReceipt.materialPackage?.name
                      : itemReceipt.productSize?.name || 'Unknown'}
                  </Text>
                  <Text className='text-green-500 font-bold '>
                    {receiptType === 'material'
                      ? itemReceipt.materialPackage?.code
                      : itemReceipt.productSize?.code || 'N/A'}
                  </Text>
                </View>

                <View className='flex-row items-center justify-between'>
                  <View>
                    {/* Import Date */}
                    <View className='flex-row items-center gap-2 mb-1'>
                      <CalendarDays size={20} color='#4CAF50' />
                      <Text className='text-sm text-gray-600'>
                        Import Date:{' '}
                        {convertDate(itemReceipt.importDate || 'N/A')}
                      </Text>
                    </View>
                    {/* Expire Date */}
                    {receiptType === 'material' && (
                      <View className='flex-row items-center gap-2'>
                        <CalendarX size={20} color='#E53E3E' />
                        <Text className='text-sm text-gray-600'>
                          Expire Date:{' '}
                          {convertDate(itemReceipt.expireDate || 'N/A')}
                        </Text>
                      </View>
                    )}
                  </View>

                  <StatusBadge className='bg-primaryLight'>
                    {itemReceipt?.code}
                  </StatusBadge>
                </View>

                {/* Actual Quantity Input */}
                <TextInput
                  label='Actual Quantity'
                  value={actualQuantity}
                  onChangeText={(text) => setActualQuantity(text)}
                  mode='outlined'
                  className='mt-4 bg-white'
                  keyboardType='numeric'
                />
              </Card.Content>
            </Card>
          </ScrollView>
        )}
      </View>
      <View className='p-4 border-t border-gray-200 bg-white'>
        <Button
          mode='contained'
          onPress={handleSave}
          className='bg-blue-600'
          labelStyle={{ color: 'white', fontWeight: 'bold' }}
        >
          Save
        </Button>
      </View>
    </View>
  );
};

export default PackagesDetail;
