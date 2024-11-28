import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { AlertCircle, ScanQrCode, Search, Info } from 'lucide-react-native';
import PackagesItem from './PackagesItem';
import EmptyDataComponent from '@/components/common/EmptyData';
import StatusBadge from '@/components/common/StatusBadge';
import Theme from '@/constants/Theme';

interface MaterialVariant {
  id: string;
  name: string;
  code: string;
  image: string;
  reorderLevel: number;
}

interface InventoryReportDetail {
  materialVariant: MaterialVariant;
  materialPackages: MaterialPackage[];
}

interface MaterialPackage {
  materialPackage: {
    id: string;
    name: string;
    code: string;
    packUnit: string;
  };
  inventoryReportDetails: InventoryReportDetail[];
}

interface ProcessedDetail {
  inventoryReportDetailId: string;
  actualQuantity: number;
  note: string;
}

interface PackagesListProps {
  inventoryReportDetail: InventoryReportDetail[];
  reportId: string;
  scannedData: string | null;
  onOpenCamera: () => void;
  filteredPackages: { query: string; package: MaterialPackage }[];
  setFilteredPackages: React.Dispatch<
    React.SetStateAction<{ query: string; package: MaterialPackage }[]>
  >;
  processedDetails: ProcessedDetail[];
  setProcessedDetails: React.Dispatch<React.SetStateAction<ProcessedDetail[]>>;
}

const PackagesList: React.FC<PackagesListProps> = ({
  inventoryReportDetail,
  scannedData,
  onOpenCamera,
  filteredPackages,
  setFilteredPackages,
  processedDetails,
  setProcessedDetails,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(''); // Input search query
  const [isDuplicateModalVisible, setIsDuplicateModalVisible] =
    useState<boolean>(false); // Modal visibility for duplicates
  const [isNotFoundModalVisible, setIsNotFoundModalVisible] =
    useState<boolean>(false); // Modal visibility for "Not Found"
  const [lastQuery, setLastQuery] = useState<string | null>(null); // Track last query for modals

  // Automatically handle scanned data and initiate search
  useEffect(() => {
    if (scannedData) {
      const extractedCode = scannedData.split('-').pop() || scannedData;
      setSearchQuery(extractedCode);
      handleSearch(extractedCode);
    }
  }, [scannedData]);

  // Handle adding/updating processed details
  const handleDetailProcessed = (detail: ProcessedDetail) => {
    setProcessedDetails((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.inventoryReportDetailId === detail.inventoryReportDetailId
      );

      if (existingIndex > -1) {
        // Update existing detail
        const updatedDetails = [...prev];
        updatedDetails[existingIndex] = detail;
        return updatedDetails;
      }

      // Add new detail
      return [...prev, detail];
    });
  };

  // Search handler
  const handleSearch = (queryOverride?: string) => {
    const query = queryOverride || searchQuery.trim();
    const formattedQuery = `MAT-REC-${query}`;

    if (!query) {
      showModal('notFound', formattedQuery);
      return;
    }

    const isDuplicate = filteredPackages.some(
      (item) => item.query === formattedQuery
    );

    if (isDuplicate) {
      showModal('duplicate', formattedQuery);
      return;
    }

    const matchingPackages: MaterialPackage[] = [];
    inventoryReportDetail.forEach((detail) => {
      detail.materialPackages.forEach((packageItem) => {
        const hasMatch = packageItem.inventoryReportDetails.some(
          (detailItem) => detailItem.materialReceipt?.code === formattedQuery
        );
        if (hasMatch) matchingPackages.push(packageItem);
      });
    });

    if (matchingPackages.length > 0) {
      setFilteredPackages((prev) => {
        const updatedPackages = [...prev];
        matchingPackages.forEach((pkg) => {
          if (!updatedPackages.some((item) => item.query === formattedQuery)) {
            updatedPackages.push({ query: formattedQuery, package: pkg });
          }
        });
        return updatedPackages;
      });
    } else {
      showModal('notFound', formattedQuery);
    }
  };

  // Helper to show modals for duplicates or "Not Found"
  const showModal = (type: 'duplicate' | 'notFound', query: string) => {
    if (lastQuery === query) return;

    setLastQuery(query);
    if (type === 'duplicate') {
      setIsDuplicateModalVisible(true);
    } else {
      setIsNotFoundModalVisible(true);
    }
  };

  return (
    <View className='flex-1 bg-white'>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 10 }}>
        {inventoryReportDetail.map((detail) => (
          <Card
            key={detail.materialVariant.id}
            className='mb-5 p-4 rounded-lg bg-white'
          >
            {/* Material Header */}
            <View className='flex-row items-center mb-4'>
              <Image
                source={{ uri: detail.materialVariant.image }}
                className='w-20 h-20 rounded-full mr-4'
              />
              <View>
                <Text className='font-bold text-lg'>
                  {detail.materialVariant.name}
                </Text>
                <View className='flex-row items-center'>
                  <Text className='text-gray-500 text-sm'>Code:</Text>
                  <StatusBadge className='ml-3 text-sm'>
                    {detail.materialVariant.code}
                  </StatusBadge>
                </View>
              </View>
            </View>

            {/* Material Packages and Search */}
            <View className='flex-row justify-between items-center my-2'>
              <Text className='font-bold text-lg'>Material Packages</Text>
              <TouchableOpacity onPress={onOpenCamera}>
                <ScanQrCode color='black' size={35} />
              </TouchableOpacity>
            </View>
            <View className='flex-row mb-4'>
              <View className='flex-1 flex-row items-center bg-gray-100 rounded-lg px-4 mr-4'>
                <Search color='gray' size={20} />
                <TextInput
                  placeholder='Enter receipt code'
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className='flex-1 ml-2'
                />
              </View>
              <Button
                mode='contained'
                onPress={() => handleSearch()}
                buttonColor='gray'
              >
                Search
              </Button>
            </View>

            {/* Filtered Packages */}
            {filteredPackages.length > 0 ? (
              filteredPackages.map(({ query, package: packageItem }) => (
                <PackagesItem
                  key={`${packageItem.materialPackage.id}-${query}`}
                  materialPackage={packageItem}
                  searchQuery={query}
                  onDetailProcessed={handleDetailProcessed}
                />
              ))
            ) : (
              <EmptyDataComponent />
            )}
          </Card>
        ))}
      </ScrollView>

      {/* Duplicate Modal */}
      <Modal
        transparent={true}
        visible={isDuplicateModalVisible}
        animationType='slide'
        onRequestClose={() => setIsDuplicateModalVisible(false)}
      >
        <View className='flex-1 justify-center items-center bg-black/50'>
          <View className='bg-white rounded-lg p-5 w-4/5'>
            <View className='items-center justify-center mb-4'>
              <AlertCircle size={50} color={Theme.error} />
              <Text className='text-lg font-semibold text-red-500'>
                Duplicate Found
              </Text>
            </View>
            <Text className='text-lg font-semibold text-center mb-4'>
              The Material Receipt already exists.
            </Text>
            <Button
              mode='outlined'
              onPress={() => setIsDuplicateModalVisible(false)}
              buttonColor={Theme.error}
              textColor='white'
            >
              Exit
            </Button>
          </View>
        </View>
      </Modal>

      {/* Not Found Modal */}
      <Modal
        transparent={true}
        visible={isNotFoundModalVisible}
        animationType='slide'
        onRequestClose={() => setIsNotFoundModalVisible(false)}
      >
        <View className='flex-1 justify-center items-center bg-black/50'>
          <View className='bg-white rounded-lg p-5 w-4/5'>
            <View className='items-center justify-center mb-4'>
              <Info size={50} color='red' />
              <Text className='text-lg font-semibold text-red-500'>
                Not Found
              </Text>
            </View>
            <Text className='text-lg font-semibold text-center mb-4'>
              No matching Material Receipt was found.
            </Text>
            <Button
              mode='outlined'
              onPress={() => setIsNotFoundModalVisible(false)}
              buttonColor='red'
              textColor='white'
            >
              Exit
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PackagesList;
