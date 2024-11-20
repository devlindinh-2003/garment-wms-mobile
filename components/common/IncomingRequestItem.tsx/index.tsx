import React from 'react';
import { Image, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { CalendarIcon } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { convertDate } from '@/helpers/converDate';

interface IncomingRequestItemProps {
  id: string;
  materialType: string;
  requestDate: string;
  imageUri: string;
  onInspectPress: () => void;
}

const IncomingRequestItem: React.FC<IncomingRequestItemProps> = ({
  id,
  materialType,
  requestDate,
  imageUri,
  onInspectPress,
}) => {
  return (
    <View className='flex-row items-center bg-white shadow-md rounded-lg my-2 p-3'>
      <Image
        source={{
          uri: 'https://firebasestorage.googleapis.com/v0/b/tro-tot.appspot.com/o/images%2Fmaterials%2F6a04e45b-b984-496d-bd0a-09f0d5a0c459%2F1730274586320-red%20button.jpg?alt=media&token=07e48b9c-e4e4-4f53-ad5a-6f3b9a2f1955',
        }}
        className='w-16 h-16 rounded-lg mr-3'
      />

      <View className='flex-1 pr-3'>
        <Text className='font-bold text-sm'>{id}</Text>
        <Text className='text-xs text-gray-500 font-semibold italic'>
          {materialType}
        </Text>

        <View className='flex-row items-center mt-1 space-x-3'>
          <CalendarIcon size={20} color='#6B7280' />
          <Text className='ml-1 text-xs text-gray-500'>
            Request date:{' '}
            <Text className='font-bold text-black'>
              {convertDate(requestDate)}
            </Text>
          </Text>
        </View>
      </View>

      <Button
        mode='outlined'
        icon='arrow-right'
        style={{ borderColor: Theme.primaryLightBackgroundColor }}
        textColor={Theme.primaryLightBackgroundColor}
        className='rounded-md border-primaryLightBackgroundColor ml-2'
        onPress={onInspectPress}
        contentStyle={{ flexDirection: 'row-reverse' }}
        labelStyle={{ fontSize: 12 }}
      >
        Inspect
      </Button>
    </View>
  );
};

export default IncomingRequestItem;
