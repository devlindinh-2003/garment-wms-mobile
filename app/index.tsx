import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

const StartPage = () => {
  const router = useRouter();

  return (
    <View className='flex-1 items-center justify-center bg-white'>
      <Text variant='headlineLarge' className='text-center mb-6'>
        Welcome
      </Text>
      <Button
        mode='contained'
        onPress={() => router.push('/(main)/(tabs)')}
        className='mb-4 bg-blue-500'
      >
        Inspection Staff
      </Button>
      <Button
        mode='contained'
        onPress={() => router.push('/(warehouse)/(tabs)')}
        className='bg-green-500'
      >
        Warehouse Staff
      </Button>
    </View>
  );
};

export default StartPage;
