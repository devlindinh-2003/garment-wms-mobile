import React, { useState, useEffect } from 'react';
import { View, Image, TextInput } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { Search } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import PackagesItem from './PackagesItem';
import EmptyDataComponent from '@/components/common/EmptyData';

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
}

const PackagesList: React.FC<PackagesListProps> = ({
  inventoryReportDetail,
}) => {
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
    {}
  );
  const [filteredPackages, setFilteredPackages] = useState<{
    [key: string]: MaterialPackage[];
  }>({});
  const [processedCodes, setProcessedCodes] = useState<Set<string>>(new Set());
  const [allCodes, setAllCodes] = useState<string[]>([]);

  useEffect(() => {
    const codes = inventoryReportDetail.flatMap((detail) =>
      detail.materialPackages.flatMap((packageItem) =>
        packageItem.inventoryReportDetails.map(
          (report) => report.materialReceipt.code
        )
      )
    );
    setAllCodes(codes);
  }, [inventoryReportDetail]);

  const handleSearchChange = (id: string, query: string) => {
    setSearchQueries((prev) => ({ ...prev, [id]: query }));
  };

  const handleSearch = (id: string) => {
    const query = searchQueries[id]?.trim();
    if (!query || query.length !== 6 || isNaN(Number(query))) return;

    // Format the query to match `MAT-REC-XXXXXX`
    const formattedQuery = `MAT-REC-${query}`;

    const detail = inventoryReportDetail.find(
      (item) => item.materialVariant.id === id
    );

    if (!detail) return;

    const matchingPackages = detail.materialPackages.filter((packageItem) =>
      packageItem.inventoryReportDetails.some((detailItem) => {
        const receiptCode = detailItem?.materialReceipt?.code || '';
        return receiptCode === formattedQuery;
      })
    );

    setFilteredPackages((prev) => ({
      ...prev,
      [id]: matchingPackages,
    }));

    // Mark the formatted query as processed
    setProcessedCodes((prev) => new Set(prev).add(formattedQuery));
  };

  const isSearchDisabled = (id: string): boolean => {
    const query = searchQueries[id]?.trim();
    if (!query || query.length !== 6 || isNaN(Number(query))) return true;

    // Format the query to match `MAT-REC-XXXXXX` and check if it's already processed
    const formattedQuery = `MAT-REC-${query}`;
    return processedCodes.has(formattedQuery);
  };

  if (!inventoryReportDetail || inventoryReportDetail.length === 0) {
    return <EmptyDataComponent />;
  }

  return (
    <View className='mt-4 px-2'>
      {inventoryReportDetail?.map((detail) => {
        const id = detail.materialVariant.id;
        const searchQuery = searchQueries[id] || '';
        const packages = filteredPackages[id] || [];

        return (
          <Card
            key={id}
            className='mb-4 rounded-lg shadow-md bg-white border border-gray-300'
          >
            <Card.Content className='p-3'>
              <View className='flex-row items-center'>
                <Image
                  source={{ uri: detail.materialVariant.image }}
                  className='w-20 h-20 rounded-lg mr-3'
                  resizeMode='cover'
                />
                <View className='flex-1'>
                  <Text className='text-lg font-bold text-gray-800 mb-1'>
                    {detail.materialVariant.name}
                  </Text>
                  <Text className='text-sm text-gray-600 mb-1'>
                    Code: {detail.materialVariant.code}
                  </Text>
                  <Text className='text-sm text-gray-500'>
                    Reorder Level: {detail.materialVariant.reorderLevel}
                  </Text>
                </View>
              </View>
              <Text
                variant='titleMedium'
                className='text-primaryLight mt-3 font-semibold'
              >
                Material Packages
              </Text>
              {/* Search Bar */}
              <View className='flex-row items-center space-x-4 mt-5'>
                <View className='flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-2'>
                  <Search color={Theme.primaryLightBackgroundColor} size={20} />
                  <TextInput
                    placeholder='Enter receipt code'
                    value={searchQuery}
                    onChangeText={(query) => handleSearchChange(id, query)}
                    className='flex-1 ml-2 text-base'
                  />
                </View>
                <Button
                  mode='contained'
                  disabled={isSearchDisabled(id)}
                  onPress={() => handleSearch(id)}
                  className={`rounded-lg ${
                    isSearchDisabled(id) ? 'bg-gray-300' : 'bg-primaryLight'
                  }`}
                >
                  Search
                </Button>
              </View>
              {/* Render Material Packages */}
              {packages.length > 0 ? (
                packages.map((packageItem) => (
                  <PackagesItem
                    key={packageItem.materialPackage.id}
                    materialPackage={packageItem}
                    searchQuery={searchQuery}
                    onCodeProcessed={(code) =>
                      setProcessedCodes((prev) => new Set(prev).add(code))
                    }
                  />
                ))
              ) : (
                <EmptyDataComponent />
              )}
            </Card.Content>
          </Card>
        );
      })}
    </View>
  );
};

export default PackagesList;
