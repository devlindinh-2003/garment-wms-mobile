import React, { useState, useEffect } from 'react';
import { View, TextInput, ScrollView, Image, Alert } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { QrCode, Search } from 'lucide-react-native';
import PackagesItem from './PackagesItem';
import StatusBadge from '@/components/common/StatusBadge';
import avatar from '@/assets/images/avatar.png';
import Theme from '@/constants/Theme';

// Interfaces for data structures
interface MaterialVariant {
  id: string;
  name: string;
  code: string;
  image: string;
}

interface ProductVariant {
  id: string;
  name: string;
  code: string;
  image: string;
}

interface InventoryReportDetail {
  materialVariant?: MaterialVariant;
  materialPackages?: MaterialPackage[];
  productVariant?: ProductVariant;
  productSizes?: ProductSize[];
}

interface MaterialPackage {
  materialPackage: {
    id: string;
    name: string;
    code: string;
    packUnit: string;
  };
  inventoryReportDetails: {
    id: string;
    materialReceipt?: { code: string };
  }[];
}

interface ProductSize {
  productSize: {
    id: string;
    name: string;
    code: string;
    size: string;
  };
  inventoryReportDetails: {
    id: string;
    productReceipt?: { code: string };
  }[];
}

interface PackagesListProps {
  inventoryReportDetail: InventoryReportDetail[];
  onOpenCamera: (onScanComplete: (barcode: string) => void) => void;
  setProcessedDetails: any;
  scannedData?: string | null;
}

const PackagesList: React.FC<PackagesListProps> = ({
  inventoryReportDetail,
  onOpenCamera,
  setProcessedDetails,
  scannedData,
}) => {
  const [searchQueries, setSearchQueries] = useState<{ [id: string]: string }>(
    {}
  );
  const [filteredPackages, setFilteredPackages] = useState<{
    [id: string]: { query: string; package: MaterialPackage | ProductSize }[];
  }>({});

  // Handle barcode scanning updates
  useEffect(() => {
    if (scannedData) {
      handleBarcodeScan(scannedData);
    }
  }, [scannedData]);

  // Handle barcode scanning and update search queries
  const handleBarcodeScan = (barcode: string) => {
    let query = '';

    // Extract relevant query from the scanned barcode
    if (barcode.startsWith('MAT-REC-')) {
      query = barcode.slice(-6); // Extract last 6 digits for material receipts
    } else if (barcode.startsWith('PRO_REC_')) {
      query = barcode.slice(-7); // Extract last 7 digits for product receipts
    }

    if (!query) {
      Alert.alert('Error', 'Invalid barcode scanned.');
      return;
    }

    // Update search query for all matching inventory report details
    inventoryReportDetail.forEach((detail) => {
      const id = detail.materialVariant?.id || detail.productVariant?.id || '';
      if (id) {
        setSearchQueries((prev) => ({ ...prev, [id]: query }));
        handleSearch(id, query);
      }
    });
  };

  // Handle search input changes
  const handleSearchChange = (id: string, query: string) => {
    setSearchQueries((prev) => ({ ...prev, [id]: query }));
  };

  // Execute the search and filter the results
  const handleSearch = (id: string, query: string) => {
    if (!query.trim()) {
      Alert.alert('Error', 'Please enter a valid receipt code.');
      return;
    }

    const detail = inventoryReportDetail.find(
      (detail) =>
        detail.materialVariant?.id === id || detail.productVariant?.id === id
    );

    if (!detail) {
      Alert.alert('Error', 'No matching inventory report detail found.');
      return;
    }

    const matchingPackages = detail.materialPackages?.filter((pkg) =>
      pkg.inventoryReportDetails.some(
        (item) =>
          item.materialReceipt?.code === `MAT-REC-${query}` ||
          item.materialReceipt?.code === query
      )
    );

    const matchingSizes = detail.productSizes?.filter((size) =>
      size.inventoryReportDetails.some(
        (item) =>
          item.productReceipt?.code === `PRO_REC_${query}` ||
          item.productReceipt?.code === query
      )
    );

    // Update the filtered packages state
    setFilteredPackages((prev) => ({
      ...prev,
      [id]: [
        ...(matchingPackages?.map((pkg) => ({ query, package: pkg })) || []),
        ...(matchingSizes?.map((size) => ({ query, package: size })) || []),
      ],
    }));
  };

  return (
    <View className='flex-1 bg-white'>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 10 }}>
        {inventoryReportDetail.map((detail) => {
          const id =
            detail.materialVariant?.id || detail.productVariant?.id || '';
          const hasFilteredPackages = filteredPackages[id]?.length > 0;

          return (
            <Card
              key={id}
              className='mb-5 p-4 rounded-lg border border-gray-300 bg-white'
            >
              {/* Header Section */}
              <View className='flex-row justify-between items-center mb-4'>
                <View className='flex-row items-center'>
                  <Image
                    source={{
                      uri:
                        detail.materialVariant?.image ||
                        detail.productVariant?.image ||
                        avatar,
                    }}
                    className='w-16 h-16 rounded-full mr-4'
                  />
                  <View>
                    <Text className='font-bold text-lg'>
                      {detail.materialVariant?.name ||
                        detail.productVariant?.name ||
                        'Unnamed'}
                    </Text>
                    <View className='flex-row items-center mt-1'>
                      <Text className='text-gray-500 mr-2'>Code:</Text>
                      <StatusBadge>
                        {detail.materialVariant?.code ||
                          detail.productVariant?.code ||
                          'No Code'}
                      </StatusBadge>
                    </View>
                  </View>
                </View>
                <QrCode
                  size={50}
                  color={Theme.primaryDarkBackgroundColor}
                  onPress={() => onOpenCamera(handleBarcodeScan)}
                />
              </View>

              {/* Search Section */}
              <View className='flex-row items-center mb-4'>
                <View className='flex-1 flex-row items-center bg-gray-100 rounded-lg px-4 py-2 mr-3'>
                  <Search color='gray' size={20} />
                  <TextInput
                    placeholder='Enter receipt code'
                    value={searchQueries[id] || ''}
                    onChangeText={(query) => handleSearchChange(id, query)}
                    className='flex-1 ml-2 text-base'
                  />
                </View>
                <Button
                  mode='contained'
                  onPress={() => handleSearch(id, searchQueries[id] || '')}
                  buttonColor={Theme.primaryLightBackgroundColor}
                >
                  Add
                </Button>
              </View>

              {/* Filtered Results Section */}
              {hasFilteredPackages ? (
                filteredPackages[id]?.map(({ query, package: packageItem }) => (
                  <PackagesItem
                    key={
                      packageItem.materialPackage?.id ||
                      packageItem.productSize?.id ||
                      ''
                    }
                    materialPackage={packageItem as MaterialPackage}
                    productSize={packageItem as ProductSize}
                    searchQuery={query}
                    onDetailProcessed={setProcessedDetails}
                  />
                ))
              ) : (
                <View className='items-center mt-2'>
                  <Text className='text-gray-500'>
                    No data found. Please search using a valid code.
                  </Text>
                </View>
              )}
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default PackagesList;
