import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Card } from 'react-native-paper';
import { Input } from '@ui-kitten/components';

interface MaterialDetailCardProps {
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

const MaterialInspectingCard: React.FC<MaterialDetailCardProps> = ({
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
    const sanitizedValue = value.replace(/[^0-9]/g, ''); // Allow only numeric characters
    const passValue = parseInt(sanitizedValue, 10) || 0;

    if (sanitizedValue !== value) {
      setStatus('danger');
      setErrorMessage('Invalid input: only numbers are allowed.');
      onUpdate(0, 0, false); // Mark as invalid
      return;
    }

    if (passValue > total) {
      setStatus('danger');
      setErrorMessage(`PASS materials cannot exceed the total (${total}).`);
      onUpdate(passValue, total - passValue, false); // Mark as invalid
    } else {
      const failValue = total - passValue;
      setStatus('basic');
      setErrorMessage('');
      setPassQuantity(sanitizedValue);
      setFailQuantity(failValue > 0 ? failValue.toString() : '0'); // Automatically set `fail` to `0` when `pass` equals `total`
      onUpdate(passValue, failValue, true); // Mark as valid
    }
  };

  return (
    <Card className='m-4 rounded-lg shadow-md'>
      {/* Total Quantity Display */}
      <View className='p-4 bg-primaryLight rounded-t-lg items-center'>
        <Text className='text-xl font-bold text-white'>
          Total Quantity: {total}
        </Text>
      </View>

      {/* Image */}
      <Card.Cover source={{ uri: image }} resizeMode='contain' />

      {/* Content */}
      <Card.Content className='p-4'>
        {/* Title Section */}
        <View className='flex-row justify-between items-center flex-wrap'>
          <Text className='text-lg font-bold text-black flex-1 mr-2'>
            {name}
          </Text>
          <Text className='text-gray-500 text-sm'>{code}</Text>
        </View>

        {/* Specification Section */}
        <Text className='text-lg font-semibold text-gray-700 mt-4'>
          Specification
        </Text>
        <View className='flex-row flex-wrap justify-between mt-2'>
          <View className='flex-1 mr-4'>
            <Text className='text-gray-500 text-sm'>Package Height:</Text>
            <Text className='text-black font-semibold'>{height}</Text>
          </View>
          <View className='flex-1'>
            <Text className='text-gray-500 text-sm'>Package Width:</Text>
            <Text className='text-black font-semibold'>{width}</Text>
          </View>
        </View>
        <View className='flex-row flex-wrap justify-between mt-2'>
          <View className='flex-1 mr-4'>
            <Text className='text-gray-500 text-sm'>Package Weight:</Text>
            <Text className='text-black font-semibold'>{weight}</Text>
          </View>
          <View className='flex-1'>
            <Text className='text-gray-500 text-sm'>Package Length:</Text>
            <Text className='text-black font-semibold'>{length}</Text>
          </View>
        </View>

        {/* PASS Materials */}
        <View className='bg-green-100 p-3 my-4 rounded-md'>
          <Text className='text-green-600 font-bold mb-2'>PASS Materials</Text>
          <Input
            placeholder='Enter number of PASS materials'
            value={passQuantity || undefined}
            onChangeText={handlePassChange}
            keyboardType='numeric'
            style={{ backgroundColor: 'white' }}
            status={status} // Use the status prop
            caption={errorMessage} // Show the error message if present
          />
        </View>

        {/* FAILED Materials */}
        <View className='bg-red-100 p-3 my-2 rounded-md'>
          <Text className='text-red-600 font-bold mb-2'>FAILED Materials</Text>
          <Input
            placeholder='Calculated automatically'
            value={failQuantity || undefined}
            disabled
            style={{ backgroundColor: '#f5f5f5' }}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

export default MaterialInspectingCard;
