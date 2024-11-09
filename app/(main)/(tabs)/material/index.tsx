import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import { PieChart } from 'react-native-gifted-charts';
import { View } from 'react-native';
import Theme from '@/constants/Theme';

const MaterialPage = () => {
  const pieData = [
    { value: 54, color: Theme.primaryLightBackgroundColor, text: '54%' },
    { value: 40, color: Theme.green[500], text: '30%' },
  ];
  return (
    <ScrollView className='px-4 py-3'>
      <Text
        style={{ fontWeight: 'bold' }}
        variant='titleMedium'
        className='text-primaryLight capitalize'
      >
        Raw Material Statistics
      </Text>
      <View className='w-full flex-row justify-center'>
        <PieChart
          donut
          textColor='black'
          radius={150}
          textSize={20}
          showTextBackground
          textBackgroundRadius={26}
          data={pieData}
        />
      </View>
    </ScrollView>
  );
};

export default MaterialPage;
