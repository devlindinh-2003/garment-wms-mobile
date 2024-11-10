import React from 'react';
import { View } from 'react-native';
import { Card, Searchbar, Text } from 'react-native-paper';

const MaterialList = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <View className='mt-5 mb-9'>
      <Card className='rounded-lg shadow-lg p-4 bg-white'>
        <View className='flex-row items-center space-x-3'>
          <Searchbar
            placeholder='Search'
            onChangeText={setSearchQuery}
            value={searchQuery}
            className='bg-blue-100 rounded-full flex-1 px-3 '
            inputStyle={{
              fontSize: 16,
            }}
            iconColor='#6E6E6E'
          />
          <Text
            variant='titleSmall'
            className='text-blue-500 font-semibold underline '
          >
            Incoming Request (10)
          </Text>
        </View>
      </Card>
    </View>
  );
};

export default MaterialList;
