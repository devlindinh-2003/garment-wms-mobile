import React from 'react';
import { Image, View } from 'react-native';
import EmptyImg from '@/assets/images/emptyData.jpg';
import { Text } from 'react-native-paper';

const EmptyDataComponent = () => {
  return (
    <View className='flex-1 items-center justify-center p-4 bg-white'>
      <Image
        source={EmptyImg}
        className='w-52 h-52 mb-4'
        resizeMode='contain'
      />
      <Text className='text-gray-500  font-bold text-xl capitalize'>
        No data available
      </Text>
    </View>
  );
};

export default EmptyDataComponent;
