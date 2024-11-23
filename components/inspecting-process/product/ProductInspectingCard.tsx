import { Input } from '@ui-kitten/components';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

interface ProductDetailCardProps {
  image: string;
  name: string;
  code: string;
  height: string;
  width: string;
  weight: string;
  length: string;
  total: number;
  pass: number;
  fail: number;
  onUpdate: (pass: number, fail: number, isValid: boolean) => void;
}

const ProductInspectingCard: React.FC<ProductDetailCardProps> = ({
  image,
  name,
  code,
  height,
  width,
  weight,
  length,
  total,
  pass,
  fail,
  onUpdate,
}) => {
  const [passQuantity, setPassQuantity] = useState<string>('');
  const [failQuantity, setFailQuantity] = useState<string>('');
  const [status, setStatus] = useState<'basic' | 'danger'>('basic');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const handlePassChange = (value: string) => {
    const sanitizedValue = value.replace(/[^0-9]/g, '');
    const passValue = parseInt(sanitizedValue, 10) || 0;

    if (sanitizedValue !== value) {
      setStatus('danger');
      setErrorMessage('Invalid input: only numbers are allowed.');
      onUpdate(0, 0, false);
      return;
    }

    if (passValue > total) {
      setStatus('danger');
      setErrorMessage(`PASS materials cannot exceed the total (${total}).`);
      onUpdate(passValue, total - passValue, false);
    } else {
      const failValue = total - passValue;
      setStatus('basic');
      setErrorMessage('');
      setPassQuantity(sanitizedValue);
      setFailQuantity(failValue > 0 ? failValue.toString() : '0');
      onUpdate(passValue, failValue, true);
    }
  };
  return (
    <Card className='m-4 rounded-lg shadow-md'>
      <Card.Cover source={{ uri: image }} resizeMode='contain' />

      <Card.Content className='p-4'>
        {/* Title Section */}
        <View className='flex-row justify-between items-center flex-wrap mb-4'>
          <Text className='text-lg font-bold text-black flex-1 mr-2'>
            {name}
          </Text>
          <Text className='text-gray-500 text-sm'>{code}</Text>
        </View>

        {/* Specification Section */}
        <Text className='text-lg font-semibold text-gray-700 mb-2'>
          Specification
        </Text>
        <View className='flex-row flex-wrap justify-between mb-4'>
          <View className='flex-1 mr-4'>
            <Text className='text-gray-500 text-sm'>Package Height:</Text>
            <Text className='text-black font-semibold'>{height}</Text>
          </View>
          <View className='flex-1'>
            <Text className='text-gray-500 text-sm'>Package Width:</Text>
            <Text className='text-black font-semibold'>{width}</Text>
          </View>
        </View>
        <View className='flex-row flex-wrap justify-between mb-4'>
          <View className='flex-1 mr-4'>
            <Text className='text-gray-500 text-sm'>Package Weight:</Text>
            <Text className='text-black font-semibold'>{weight}</Text>
          </View>
          <View className='flex-1'>
            <Text className='text-gray-500 text-sm'>Package Length:</Text>
            <Text className='text-black font-semibold'>{length}</Text>
          </View>
        </View>

        {/* Total Quantity Display */}
        <View className='bg-blue-100 p-3 mb-4 rounded-md'>
          <Text className='text-blue-600 font-bold text-center'>
            Total Quantity: {total}
          </Text>
        </View>

        {/* PASS Materials */}
        <View className='bg-green-100 p-3 mb-4 rounded-md'>
          <Text className='text-green-600 font-bold mb-2'>PASS Materials</Text>
          <Input
            placeholder='Enter number of PASS materials'
            value={passQuantity}
            onChangeText={handlePassChange}
            keyboardType='numeric'
            className='bg-white'
          />
          {errorMessage ? (
            <Text className='text-red-500 text-sm mt-1'>{errorMessage}</Text>
          ) : null}
        </View>

        {/* FAILED Materials */}
        <View className='bg-red-100 p-3 rounded-md'>
          <Text className='text-red-600 font-bold mb-2'>FAILED Materials</Text>
          <Input
            placeholder='Calculated automatically'
            value={failQuantity}
            disabled
            className='bg-gray-100'
          />
        </View>
      </Card.Content>
    </Card>
  );
};

export default ProductInspectingCard;
