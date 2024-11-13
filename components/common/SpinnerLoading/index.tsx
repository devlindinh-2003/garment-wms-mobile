import { Spinner } from '@ui-kitten/components';
import React from 'react';
import { View } from 'react-native';

const SpinnerLoading = () => {
  return (
    <View className='flex-1 justify-center items-center '>
      <Spinner size='giant' />
    </View>
  );
};

export default SpinnerLoading;
