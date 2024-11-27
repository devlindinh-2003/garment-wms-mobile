import React, { FC } from 'react';
import { View, TextInput, Text } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { Search } from 'lucide-react-native';
import Theme from '@/constants/Theme';

interface SearchCardProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  isSearchDisabled: boolean; // Added prop to control button state
}

const SearchCard: FC<SearchCardProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  isSearchDisabled,
}) => {
  return (
    <Card className='bg-white rounded-xl shadow-lg overflow-hidden'>
      <Card.Content className='p-6'>
        <Text className='text-lg font-semibold text-gray-800 mb-4'>
          Search Material Receipt
        </Text>
        <View className='flex-row items-center space-x-4'>
          <View className='flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-2'>
            <Search color={Theme.primaryLightBackgroundColor} size={20} />
            <TextInput
              placeholder='Enter code'
              value={searchQuery}
              onChangeText={setSearchQuery}
              className='flex-1 ml-2 text-base'
            />
          </View>
          <Button
            mode='contained'
            onPress={handleSearch}
            disabled={isSearchDisabled} // Button is disabled when `isSearchDisabled` is true
            className={`${
              isSearchDisabled ? 'bg-gray-300' : 'bg-primaryLight'
            } rounded-lg px-4`}
          >
            Search
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

export default SearchCard;
