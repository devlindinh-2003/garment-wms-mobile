import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredPackages, setFilteredPackages] = useState<
    { query: string; package: MaterialPackage }[]
  >([]);
  const [processedCodes, setProcessedCodes] = useState<Set<string>>(new Set());

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearch = () => {
    const query = searchQuery.trim();
    if (!query || query.length !== 6 || isNaN(Number(query))) return;

    // Format the query to match `MAT-REC-XXXXXX`
    const formattedQuery = `MAT-REC-${query}`;

    // Check if the query has already been processed
    if (processedCodes.has(formattedQuery)) return;

    const matchingPackages: MaterialPackage[] = [];

    inventoryReportDetail.forEach((detail) => {
      detail.materialPackages.forEach((packageItem) => {
        const hasMatch = packageItem.inventoryReportDetails.some(
          (detailItem) => detailItem.materialReceipt.code === formattedQuery
        );
        if (hasMatch) {
          matchingPackages.push(packageItem);
        }
      });
    });

    if (matchingPackages.length > 0) {
      setFilteredPackages((prev) => [
        ...prev,
        ...matchingPackages.map((pkg) => ({
          query: formattedQuery,
          package: pkg,
        })),
      ]);
      setProcessedCodes((prev) => new Set(prev).add(formattedQuery));
    }
  };

  const isSearchDisabled = (): boolean => {
    const query = searchQuery.trim();
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
      <Card className='mb-4 rounded-lg shadow-md bg-white border border-gray-300'>
        <Card.Content className='p-3'>
          <View className='flex-row items-center space-x-4 mt-5'>
            <View className='flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-2'>
              <Search color={Theme.primaryLightBackgroundColor} size={20} />
              <TextInput
                placeholder='Enter receipt code'
                value={searchQuery}
                onChangeText={(query) => handleSearchChange(query)}
                className='flex-1 ml-2 text-base'
              />
            </View>
            <Button
              mode='contained'
              disabled={isSearchDisabled()}
              onPress={handleSearch}
              className={`rounded-lg ${
                isSearchDisabled() ? 'bg-gray-300' : 'bg-primaryLight'
              }`}
            >
              Search
            </Button>
          </View>
        </Card.Content>
      </Card>
      {/* Render Filtered Packages */}
      {filteredPackages.length > 0 ? (
        filteredPackages.map(({ query, package: packageItem }) => (
          <PackagesItem
            key={`${packageItem.materialPackage.id}-${query}`} // Ensure unique key
            materialPackage={packageItem}
            searchQuery={query}
            onCodeProcessed={(code) =>
              setProcessedCodes((prev) => new Set(prev).add(code))
            }
          />
        ))
      ) : (
        <Text style={{ color: 'gray', marginTop: 10, textAlign: 'center' }}>
          No data available. Please use the search bar to find matching data.
        </Text>
      )}
    </View>
  );
};

export default PackagesList;
