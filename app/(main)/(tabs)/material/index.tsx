import React from 'react';
import { ScrollView } from 'react-native';
import MaterialStatistic from '@/components/material/MaterialStatistic';
import { Text } from 'react-native-paper';
import MaterialList from '@/components/material/MaterialList';

const MaterialPage = () => {
  return (
    <ScrollView className='px-4 py-3 bg-gray-100 space-y-3'>
      <Text
        style={{ fontWeight: 'bold' }}
        variant='titleLarge'
        className='text-primaryLight capitalize mb-2 text-center'
      >
        Raw Material Statistics
      </Text>
      {/* Material Statistic */}
      <MaterialStatistic />
      {/* Material Table */}
      <MaterialList />
    </ScrollView>
  );
};

export default MaterialPage;
