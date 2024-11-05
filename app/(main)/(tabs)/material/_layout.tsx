import SafeAreaLayout from '@/components/common/SafeAreaLayout';
import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

const MaterialLayout = () => {
  return (
    <SafeAreaLayout>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </SafeAreaLayout>
  );
};

export default MaterialLayout;
