import React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { PieChart } from 'react-native-gifted-charts';
import Theme from '@/constants/Theme';

const MaterialPage = () => {
  const pieData = [
    { value: 2, color: Theme.primaryLightBackgroundColor, text: 'Inspecting' },
    { value: 3, color: Theme.green[500], text: 'Inspected' },
  ];

  return (
    <ScrollView className='px-4 py-3 bg-gray-100'>
      <Text
        style={{ fontWeight: 'bold' }}
        variant='titleMedium'
        className='text-primaryLight capitalize mb-2'
      >
        Raw Material Statistics
      </Text>

      <Card className='rounded-lg shadow-lg p-4 bg-white items-center'>
        <Text className='text-gray-500 text-sm mb-1'>Total Request</Text>
        <Text className='text-3xl font-bold text-gray-900 mb-5'>8</Text>
        <View className='flex-row justify-center'>
          <PieChart
            donut
            radius={100}
            innerRadius={60}
            data={pieData}
            textColor='black'
            textSize={20}
            showTextBackground
            textBackgroundRadius={26}
          />
        </View>

        {/* Legend Section */}
        <View className='flex-col items-start mt-5 w-full px-5 space-y-2'>
          {pieData.map((item, index) => (
            <View
              key={index}
              className='flex-row items-center justify-between w-full'
            >
              <View className='flex-row items-center'>
                <View
                  className='w-3 h-3 rounded-full mr-2'
                  style={{ backgroundColor: item.color }}
                />
                <Text className='text-gray-700'>{item.text}</Text>
              </View>
              <Text className='text-gray-700'>{item.value}</Text>
            </View>
          ))}
        </View>
      </Card>
    </ScrollView>
  );
};

export default MaterialPage;
