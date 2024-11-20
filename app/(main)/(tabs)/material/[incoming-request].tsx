import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AppbarHeader from '@/components/common/AppBarHeader';
import { ScrollView } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import { InspectionRequest } from '@/types/InspectionRequest';
import IncomingRequestItem from '@/components/common/IncomingRequestItem.tsx';

const IncomingRequest = () => {
  const { inspectingRequestsList } = useLocalSearchParams();
  const [inspectingRequests, setInspectingRequests] = useState<
    InspectionRequest[]
  >([]);

  useEffect(() => {
    if (inspectingRequestsList) {
      try {
        const parsedData = JSON.parse(inspectingRequestsList as string);
        setInspectingRequests(parsedData);
      } catch (error) {
        console.error('Failed to parse inspecting requests:', error);
      }
    }
  }, [inspectingRequestsList]);

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

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <AppbarHeader title='Incoming Request' onPress={handleBackPress} />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 16,
          paddingHorizontal: 16,
        }}
      >
        <View style={{ alignItems: 'center', paddingHorizontal: 8 }}>
          <Text variant='titleSmall' style={{ fontWeight: 'bold' }}>
            Total Request
          </Text>
          <Text
            variant='titleLarge'
            style={{ fontWeight: 'bold', color: '#1F2937' }}
          >
            {inspectingRequests.length}
          </Text>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 8 }}>
          <DropDownPicker
            open={openDropdown}
            value={selectedDropdownValue}
            items={items}
            setOpen={setOpenDropdown}
            setValue={setSelectedDropdownValue}
            setItems={setItems}
            placeholder='Date'
            placeholderStyle={{ color: '#9CA3AF', fontWeight: 'bold' }}
            dropDownContainerStyle={{
              backgroundColor: '#f9fafb',
              borderColor: '#E5E7EB',
            }}
            style={{
              backgroundColor: '#F3F4F6',
              borderRadius: 10,
              borderColor: '#D1D5DB',
            }}
            labelStyle={{ fontSize: 16, color: '#111827' }}
            listItemLabelStyle={{ color: '#4B5563' }}
            selectedItemLabelStyle={{ fontWeight: 'bold', color: '#1F2937' }}
            arrowIconStyle={{ width: 20, height: 20 }}
          />
        </View>
      </View>

      <ScrollView style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
        {inspectingRequests.map((request) => {
          const materialPackage =
            request.importRequest?.importRequestDetail?.[0]?.materialPackage;
          const materialVariant = materialPackage?.materialVariant;
          const imageUri =
            materialVariant?.image ||
            'https://example.com/default-placeholder.png';

          return (
            <IncomingRequestItem
              key={request.id}
              id={request.code}
              materialType={materialVariant?.name || 'Unknown Material'}
              requestDate={request.createdAt || ''}
              imageUri={imageUri}
              onInspectPress={() => console.log(`Inspect ${request.id}`)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default IncomingRequest;
