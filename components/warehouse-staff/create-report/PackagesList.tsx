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

interface PackagesListProps {
  inventoryReportDetail: InventoryReportDetail[];
  reportId: string;
  scannedData: string | null;
  onOpenCamera: () => void;
  filteredPackages: { query: string; package: MaterialPackage }[];
  setFilteredPackages: React.Dispatch<
    React.SetStateAction<{ query: string; package: MaterialPackage }[]>
  >;
}

const PackagesList: React.FC<PackagesListProps> = ({
  inventoryReportDetail,
  scannedData,
  onOpenCamera,
  filteredPackages,
  setFilteredPackages,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(''); // Input search
  const [isSearchEnabled, setIsSearchEnabled] = useState<boolean>(false);
  const [isDuplicateModalVisible, setIsDuplicateModalVisible] =
    useState<boolean>(false); // Modal visibility for duplicate
  const [isNotFoundModalVisible, setIsNotFoundModalVisible] =
    useState<boolean>(false); // Modal visibility for "Not Found"
  const [lastDuplicateQuery, setLastDuplicateQuery] = useState<string | null>(
    null
  ); // Track last duplicate query
  const [lastNotFoundQuery, setLastNotFoundQuery] = useState<string | null>(
    null
  ); // Track last "Not Found" query

  // Automatically handle scanned data and add to filteredPackages
  useEffect(() => {
    if (scannedData) {
      const extractedCode = scannedData.split('-').pop() || scannedData;
      setSearchQuery(extractedCode);
      handleSearch(extractedCode);
    }
  }, [scannedData]);

  // Check search validity
  useEffect(() => {
    const formattedQuery = `MAT-REC-${searchQuery.trim()}`;

    const existsInInventory = inventoryReportDetail.some((detail) =>
      detail.materialPackages.some((pkg) =>
        pkg.inventoryReportDetails.some(
          (item) => item.materialReceipt?.code === formattedQuery
        )
      )
    );

    const existsInFiltered = filteredPackages.some(
      (item) => item.query === formattedQuery
    );

    setIsSearchEnabled(existsInInventory && !existsInFiltered);
  }, [searchQuery, inventoryReportDetail, filteredPackages]);

  // Handle duplicate material receipt
  const handleDuplicate = (query: string) => {
    if (lastDuplicateQuery !== query) {
      setLastDuplicateQuery(query);
      setIsDuplicateModalVisible(true);
    }
  };

  // Handle "Not Found" material receipt
  const handleNotFound = (query: string) => {
    if (lastNotFoundQuery !== query) {
      setLastNotFoundQuery(query);
      setIsNotFoundModalVisible(true);
    }
  };

  // Search handler
  const handleSearch = (queryOverride?: string) => {
    const query = queryOverride || searchQuery.trim();
    const formattedQuery = `MAT-REC-${query}`;

    if (!query) {
      setIsNotFoundModalVisible(true);
      return;
    }

    const isDuplicate = filteredPackages.some(
      (item) => item.query === formattedQuery
    );

    if (isDuplicate) {
      handleDuplicate(formattedQuery);
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
          const exists = updatedPackages.some(
            (item) => item.query === formattedQuery
          );
          if (!exists) {
            updatedPackages.push({ query: formattedQuery, package: pkg });
          }
        });
        return updatedPackages;
      });
    } else {
      handleNotFound(formattedQuery);
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
                  <StatusBadge>{detail.materialVariant.code}</StatusBadge>
                </View>
              </View>
            </View>
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
                disabled={!isSearchEnabled}
              >
                Search
              </Button>
            </View>
            {filteredPackages.length > 0 ? (
              filteredPackages.map(({ query, package: packageItem }) => (
                <PackagesItem
                  key={`${packageItem.materialPackage.id}-${query}`}
                  materialPackage={packageItem}
                  searchQuery={query}
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
