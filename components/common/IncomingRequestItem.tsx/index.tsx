import React from 'react';
import { View, Image, ImageSourcePropType } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { CalendarIcon } from 'lucide-react-native';
import Theme from '@/constants/Theme';

interface IncomingRequestItemProps {
  id: string;
  materialType: string;
  requestDate: string;
  imageSrc: ImageSourcePropType;
  onInspectPress: () => void;
}

const IncomingRequestItem: React.FC<IncomingRequestItemProps> = ({
  id,
  materialType,
  requestDate,
  imageSrc,
  onInspectPress,
}) => {
  return (
    <View className='flex-row items-center justify-between bg-white shadow-md rounded-lg my-3 p-3'>
      <Image
        source={imageSrc}
        className='w-16 h-16 rounded-md mr-3'
        resizeMode='cover'
      />

      <View className='flex-1'>
        <Text className='font-bold'>{id}</Text>
        <Text className='text-xs text-gray-500 font-semibold italic'>
          {materialType}
        </Text>

        <View className='flex-row items-center mt-1'>
          <CalendarIcon size={20} color='#6B7280' />
          <Text className='ml-1 text-xs text-gray-500'>
            Request date:{' '}
            <Text className='font-bold text-black'>{requestDate}</Text>
          </Text>
        </View>
      </View>

      <Button
        icon='arrow-right'
        mode='outlined'
        textColor={Theme.primaryLightBackgroundColor}
        className='rounded-md w-28'
        onPress={onInspectPress}
        contentStyle={{ flexDirection: 'row-reverse' }}
        style={{ borderColor: Theme.primaryLightBackgroundColor }}
      >
        Inspect
      </Button>
    </View>
  );
};

export default IncomingRequestItem;
