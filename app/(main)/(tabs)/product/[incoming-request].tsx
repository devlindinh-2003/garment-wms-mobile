import React, { useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AppbarHeader from '@/components/common/AppBarHeader';
import { ScrollView } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import IncomingRequestItem from '@/components/common/IncomingRequestItem.tsx';
import productImg from '@/assets/images/productSample.png';

const IncomingRequest = () => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedDropdownValue, setSelectedDropdownValue] = useState<
    string | null
  >(null);
  const [items, setItems] = useState([
    { label: 'Oldest to Newest', value: 'oldest' },
    { label: 'Newest to Oldest', value: 'newest' },
  ]);

  const router = useRouter();
  const handleBackPress = () => {
    router.back();
  };

  const mockRequests = Array.from({ length: 20 }, (_, index) => ({
    id: `INS-REQ-${String(index + 1).padStart(6, '0')}`,
    materialType: index % 2 === 0 ? 'Fabric' : 'Metal',
    requestDate: `May ${16 + index}, 2022`,
    imageSrc: productImg,
  }));

  return (
    <View className='flex-1 bg-white'>
      <AppbarHeader title='Incoming Request' onPress={handleBackPress} />

      {/* Title + Sort Date */}
      <View className='flex-row items-center justify-between mb-4 px-4'>
        <View className='space-y-2 items-center px-5'>
          <Text variant='titleSmall' className='font-bold'>
            Total Request
          </Text>
          <Text variant='titleLarge' className='font-bold text-primaryLight'>
            {mockRequests.length}
          </Text>
        </View>
        <View className='flex-1 px-4'>
          <DropDownPicker
            open={openDropdown}
            value={selectedDropdownValue}
            items={items}
            setOpen={setOpenDropdown}
            setValue={setSelectedDropdownValue}
            setItems={setItems}
            placeholder='Date'
            placeholderStyle={{
              color: '#9CA3AF',
              fontWeight: 'bold',
            }}
            dropDownContainerStyle={{
              backgroundColor: '#f9fafb',
              borderColor: '#E5E7EB',
            }}
            style={{
              backgroundColor: '#F3F4F6',
              borderRadius: 10,
              borderColor: '#D1D5DB',
            }}
            labelStyle={{
              fontSize: 16,
              color: '#111827',
            }}
            listItemLabelStyle={{
              color: '#4B5563',
            }}
            selectedItemLabelStyle={{
              fontWeight: 'bold',
              color: '#1F2937',
            }}
            arrowIconStyle={{
              width: 20,
              height: 20,
            }}
          />
        </View>
      </View>

      {/* List request */}
      <ScrollView className='px-3 py-2'>
        {mockRequests.map((request) => (
          <IncomingRequestItem
            key={request.id}
            id={request.id}
            materialType={request.materialType}
            requestDate={request.requestDate}
            imageSrc={request.imageSrc}
            onInspectPress={() => console.log(`Inspect ${request.id}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default IncomingRequest;
