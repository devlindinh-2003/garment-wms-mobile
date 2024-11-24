import StatusBadge from '@/components/common/StatusBadge';
import React from 'react';
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
}

const ProductDetailCard: React.FC<ProductDetailCardProps> = ({
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
}) => {
  return (
    <Card className='m-4 rounded-lg shadow-md'>
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

        {/* Summary Section */}
        <Text className='text-lg font-semibold text-gray-700 mt-4'>
          Summary
        </Text>
        <View className='mt-3'>
          <View className='flex-row items-center justify-between p-2 rounded-md bg-gray-200'>
            <Text className='text-gray-600 text-sm'>Total</Text>
            <Text className='text-black font-bold'>{total}</Text>
          </View>
          <View className='flex-row items-center justify-between p-2 rounded-md bg-green-100 mt-2'>
            <Text className='text-green-700 text-sm'>Pass</Text>
            <Text className='text-green-700 font-bold'>
              {pass} / {total}
            </Text>
          </View>
          <View className='flex-row items-center justify-between p-2 rounded-md bg-red-100 mt-2'>
            <Text className='text-red-700 text-sm'>Fail</Text>
            <Text className='text-red-700 font-bold'>
              {fail} / {total}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export default ProductDetailCard;
