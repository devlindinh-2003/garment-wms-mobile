import React from 'react';
import { View, Text } from 'react-native';
import { Card } from 'react-native-paper';
import sampleImg from '@/assets/images/materialSample.png';

const MaterialDetailCard = () => {
  return (
    <Card className='m-4 rounded-lg shadow-md'>
      {/* Image */}
      <Card.Cover source={sampleImg} className='rounded-t-lg' />

      {/* Content */}
      <Card.Content className='p-4'>
        {/* Title Section */}
        <View className='flex-row justify-between items-center'>
          <Text className='text-lg font-bold text-black'>Red Fabric ABC</Text>
          <Text className='text-gray-500 text-sm'>MAT-FAB-0006</Text>
        </View>

        {/* Specification Section */}
        <Text className='text-lg font-semibold text-gray-700 mt-4'>
          Specification
        </Text>
        <View className='flex-row justify-between mt-2'>
          <View>
            <Text className='text-gray-500 text-sm'>Package Height:</Text>
            <Text className='text-black font-semibold'>0.5m</Text>
          </View>
          <View>
            <Text className='text-gray-500 text-sm'>Package Width:</Text>
            <Text className='text-black font-semibold'>0.4m</Text>
          </View>
        </View>
        <View className='flex-row justify-between mt-2'>
          <View>
            <Text className='text-gray-500 text-sm'>Package Weight:</Text>
            <Text className='text-black font-semibold'>0.75kg</Text>
          </View>
          <View>
            <Text className='text-gray-500 text-sm'>Package Length:</Text>
            <Text className='text-black font-semibold'>0.45m</Text>
          </View>
        </View>

        {/* Summary Section */}
        <Text className='text-lg font-semibold text-gray-700 mt-4'>
          Summary
        </Text>
        <View className='mt-3'>
          <View className='flex-row items-center justify-between p-2 rounded-md bg-gray-200'>
            <Text className='text-gray-600 text-sm'>Total</Text>
            <Text className='text-black font-bold'>80 / 100</Text>
          </View>
          <View className='flex-row items-center justify-between p-2 rounded-md bg-green-100 mt-2'>
            <Text className='text-green-700 text-sm'>Pass</Text>
            <Text className='text-green-700 font-bold'>52 / 100</Text>
          </View>
          <View className='flex-row items-center justify-between p-2 rounded-md bg-red-100 mt-2'>
            <Text className='text-red-700 text-sm'>Fail</Text>
            <Text className='text-red-700 font-bold'>61 / 100</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export default MaterialDetailCard;
