import SafeAreaLayout from '@/components/common/SafeAreaLayout';
import { Stack } from 'expo-router';
import React from 'react';

const NotificationLayout = () => {
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

export default NotificationLayout;