import React from 'react';
import { View, Text, Image } from 'react-native';
import { Card, Divider } from 'react-native-paper';
import { InventoryReportDetailRoot } from '@/types/InventoryReport';
import StatusBadge from '@/components/common/StatusBadge';
import PackagesItem from './PackagesItem'; // Importing PackagesItem

interface PackagesListProps {
  inventoryReportDetail: InventoryReportDetailRoot[];
}

const PackagesList: React.FC<PackagesListProps> = ({
  inventoryReportDetail,
}) => {
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
              {/* Render Inventory Report Details using PackagesItem */}
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
