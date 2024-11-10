import React from 'react';
import { View, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { CalendarIcon } from 'lucide-react-native';
import materialImg from '@/assets/images/materialSample.png';
import Theme from '@/constants/Theme';

const IncomingRequestItem = () => {
  return (
    <View className='flex-row items-center justify-between bg-white shadow-md rounded-lg my-3'>
      <Image
        source={materialImg}
        className='w-16 h-16 rounded-md mr-3'
        resizeMode='cover'
      />
      <View className='flex-1'>
        <Text className=' font-bold'>INS-REQ-000001</Text>
        <Text className='text-xs text-gray-500 font-semibold italic'>
          Fabric
        </Text>

        <View className='flex-row items-center mt-1'>
          <CalendarIcon size={14} color='#6B7280' />
          <Text className='ml-1 text-xs text-gray-500'>
            Request date:{' '}
            <Text className='font-bold text-black text-xs'>May 16, 2022</Text>
          </Text>
        </View>
      </View>

      <Button
        icon='arrow-right'
        mode='outlined'
        textColor={Theme.primaryLightBackgroundColor}
        className='rounded-md w-28'
        onPress={() => console.log('Pressed')}
        contentStyle={{ flexDirection: 'row-reverse' }}
        style={{ borderColor: Theme.primaryLightBackgroundColor }}
      >
        Inspect
      </Button>
    </View>
  );
};

export default IncomingRequestItem;
