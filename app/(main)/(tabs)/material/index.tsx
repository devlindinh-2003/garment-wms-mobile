import React from 'react';
import { ScrollView } from 'react-native';
import MaterialStatistic from '@/components/material/MaterialStatistic';
import { Text } from 'react-native-paper';

const MaterialPage = () => {
  return (
    <ScrollView className='px-4 py-3 bg-gray-100'>
      <Text
        style={{ fontWeight: 'bold' }}
        variant='titleMedium'
        className='text-primaryLight capitalize mb-2'
      >
        Raw Material Statistics
      </Text>
      {/* Material Statistic */}
      <MaterialStatistic />
      {/* Material Table */}
    </ScrollView>
  );
};

export default MaterialPage;
