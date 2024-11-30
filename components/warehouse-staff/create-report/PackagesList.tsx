import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { Button, Card, Divider, TextInput } from 'react-native-paper';
import { InventoryReportDetailRoot } from '@/types/InventoryReport';
import StatusBadge from '@/components/common/StatusBadge';
import PackagesItem from './PackagesItem';
import Theme from '@/constants/Theme';

interface PackagesListProps {
  inventoryReportDetail: InventoryReportDetailRoot[];
}

const PackagesList: React.FC<PackagesListProps> = ({
  inventoryReportDetail,
}) => {
  const [searchQueries, setSearchQueries] = useState<{ [key: number]: string }>(
    {}
  );
  const [isButtonDisabled, setIsButtonDisabled] = useState<{
    [key: number]: boolean;
  }>(() => {
    const initialState: { [key: number]: boolean } = {};
    inventoryReportDetail.forEach((_, index) => {
      initialState[index] = true; // Default disabled for all search buttons
    });
    return initialState;
  });

  const handleSearch = (index: number) => {
    const searchQuery = searchQueries[index] || '';
    let found = false;

    const detail = inventoryReportDetail[index];
    // Search in materialPackages
    detail.materialPackages?.forEach((pkg) => {
      pkg.inventoryReportDetails.forEach((report) => {
        if (report.materialReceipt?.code === searchQuery) {
          found = true;
        }
      });
    });

    // Search in productSizes
    detail.productSizes?.forEach((size) => {
      size.inventoryReportDetails.forEach((report: any) => {
        if (report.productReceipt?.code === searchQuery) {
          found = true;
        }
      });
    });

    console.log(found ? 'true' : 'false');
  };

  const handleInputChange = (index: number, text: string) => {
    setSearchQueries((prev) => ({
      ...prev,
      [index]: text,
    }));

    const searchQuery = text;
    let found = false;

    const detail = inventoryReportDetail[index];
    // Search in materialPackages
    detail.materialPackages?.forEach((pkg) => {
      pkg.inventoryReportDetails.forEach((report) => {
        if (report.materialReceipt?.code === searchQuery) {
          found = true;
        }
      });
    });

    detail.productSizes?.forEach((size) => {
      size.inventoryReportDetails.forEach((report: any) => {
        if (report.productReceipt?.code === searchQuery) {
          found = true;
        }
      });
    });

    setIsButtonDisabled((prev) => ({
      ...prev,
      [index]: !text || !found,
    }));
  };

  return (
    <View className='p-2 bg-white'>
      {inventoryReportDetail?.map((detail, index) => (
        <Card key={index} className='mb-4 rounded-lg shadow-sm bg-slate-100'>
          <Card.Content>
            <View className='flex flex-row justify-between items-center'>
              {/* Display Image */}
              <Image
                source={{
                  uri:
                    detail?.materialVariant?.image ||
                    detail?.productVariant?.image ||
                    '',
                }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 8,
                  marginRight: 16,
                }}
                resizeMode='cover'
              />

              {/* Display Material or Product Information */}
              <View className='flex-1'>
                {detail?.materialVariant ? (
                  <>
                    <Text className='text-lg font-semibold text-gray-800 mb-2'>
                      Material:{' '}
                      {detail.materialVariant.name || 'Unknown Material'}
                    </Text>
                    <StatusBadge className='text-sm bg-gray-600 mb-2'>
                      {detail.materialVariant.code || 'N/A'}
                    </StatusBadge>
                  </>
                ) : detail?.productVariant ? (
                  <>
                    <Text className='text-lg font-semibold text-gray-800 mb-2'>
                      Product: {detail.productVariant.name || 'Unknown Product'}
                    </Text>
                    <StatusBadge className='text-sm bg-gray-600 mb-2'>
                      {detail.productVariant.code || 'N/A'}
                    </StatusBadge>
                  </>
                ) : (
                  <Text className='text-sm text-gray-500'>
                    No material or product information available.
                  </Text>
                )}
              </View>
            </View>
            <Divider className='my-2' />
            <View>
              <Text className='font-semibold text-lg text-blue-600 mb-2'>
                Inventory Report Details
              </Text>

              {/* Search Bar and Button */}
              <View className='space-y-3 mb-3'>
                <TextInput
                  placeholder='Search by Receipt Code'
                  value={searchQueries[index] || ''}
                  activeOutlineColor={Theme.blue[600]}
                  outlineColor={Theme.blue[200]}
                  onChangeText={(text) => handleInputChange(index, text)}
                  mode='outlined'
                  className='flex-1 bg-white'
                />
                <Button
                  icon='magnify'
                  mode='contained'
                  onPress={() => handleSearch(index)}
                  disabled={isButtonDisabled[index]}
                  buttonColor={
                    isButtonDisabled[index]
                      ? Theme.gray[300]
                      : Theme.primaryLightBackgroundColor
                  }
                  labelStyle={{
                    color: isButtonDisabled[index] ? Theme.gray[500] : 'white',
                    fontWeight: 'bold',
                  }}
                >
                  Search
                </Button>
              </View>
            </View>

            {/* Render Inventory Report Details */}
            <View>
              {detail?.materialPackages?.map((pkg, pkgIndex) => (
                <PackagesItem
                  key={pkgIndex}
                  details={pkg.inventoryReportDetails}
                />
              ))}
              {detail?.productSizes?.map((size, sizeIndex) => (
                <PackagesItem
                  key={sizeIndex}
                  details={size.inventoryReportDetails}
                />
              ))}
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
};

export default PackagesList;
