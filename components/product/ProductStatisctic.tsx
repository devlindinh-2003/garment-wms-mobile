import Theme from '@/constants/Theme';
import React from 'react';
import { View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Card, Text } from 'react-native-paper';

const ProductStatisctic = () => {
  const pieData1 = [
    { value: 22, color: Theme.primaryLightBackgroundColor, text: 'Inspecting' },
    { value: 13, color: Theme.green[500], text: 'Inspected' },
  ];
  const pieDataInspecting = [
    { value: 80, color: Theme.primaryLightBackgroundColor },
    { value: 20, color: 'lightgray' },
  ];
  const pieDataInspected = [
    { value: 20, color: Theme.green[500] },
    { value: 80, color: 'lightgray' },
  ];
  return (
    <View>
      <Card className='rounded-lg shadow-lg p-4 bg-white items-center'>
        <Text className='text-gray-500 text-sm mb-1'>Total Request</Text>
        <Text className='text-3xl font-bold text-gray-900 mb-5'>22</Text>
        {/* Sumamry Chart */}
        <View>
          <View className='flex-row justify-center'>
            <PieChart
              donut
              radius={100}
              innerRadius={60}
              data={pieData1}
              textColor='black'
              textSize={20}
              showTextBackground
              textBackgroundRadius={26}
            />
          </View>

          <View className='flex-col items-start mt-5 w-full px-5 space-y-2'>
            {pieData1.map((item, index) => (
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
        </View>
        {/* Specific Chart */}
        <View className='mt-9 flex-row justify-between '>
          <View className='space-y-3 items-center'>
            <PieChart
              donut
              innerRadius={50}
              radius={65}
              data={pieDataInspecting}
              centerLabelComponent={() => {
                return <Text variant='titleLarge'>70%</Text>;
              }}
            />
            <Text
              variant='titleMedium'
              style={{ fontWeight: 'bold' }}
              className='capitalize'
            >
              Inspecting
            </Text>
          </View>

          <View className='space-y-3 items-center'>
            <PieChart
              donut
              innerRadius={50}
              radius={65}
              data={pieDataInspected}
              centerLabelComponent={() => {
                return <Text variant='titleLarge'>31%</Text>;
              }}
            />
            <Text
              variant='titleMedium'
              style={{ fontWeight: 'bold' }}
              className='capitalize'
            >
              Inspected
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
};

export default ProductStatisctic;
