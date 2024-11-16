import StatusBadge from '@/components/common/StatusBadge';
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
  onUpdate: (pass: number, fail: number) => void;
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
  const [passQuantity, setPassQuantity] = useState<string>(
    pass > 0 ? pass.toString() : ''
  );
  const [failQuantity, setFailQuantity] = useState<string>(
    fail > 0 ? fail.toString() : ''
  );
  const [status, setStatus] = useState<'basic' | 'danger'>('basic');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handlePassChange = (value: string) => {
    const passValue = parseInt(value, 10) || 0;

    if (passValue > total) {
      setStatus('danger');
      setErrorMessage(`PASS materials cannot exceed the total (${total}).`);
      setPassQuantity(value); // Keep showing the invalid value for user feedback
    } else {
      const failValue = total - passValue;

      setStatus('basic');
      setErrorMessage('');
      setPassQuantity(value); // Update the valid value
      setFailQuantity(failValue > 0 ? failValue.toString() : '');
      onUpdate(passValue, failValue);
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
          <StatusBadge variant='type' className='text-gray-500 text-sm'>
            {code}
          </StatusBadge>
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
