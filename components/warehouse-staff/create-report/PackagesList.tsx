import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { Button, Card, Divider, TextInput } from 'react-native-paper';
import { InventoryReportDetailRoot } from '@/types/InventoryReport';
import StatusBadge from '@/components/common/StatusBadge';
import PackagesItem from './PackagesItem';
import Theme from '@/constants/Theme';
import { QrCode, Scan } from 'lucide-react-native';

interface PackagesListProps {
  inventoryReportDetail: InventoryReportDetailRoot[];
}

const PackagesList: React.FC<PackagesListProps> = ({
  inventoryReportDetail,
}) => {
  const [detailsState, setDetailsState] = useState(inventoryReportDetail);
  const [searchQueries, setSearchQueries] = useState<{ [key: number]: string }>(
    {}
  );
  const [isButtonDisabled, setIsButtonDisabled] = useState<{
    [key: number]: boolean;
  }>(() => {
    const initialState: { [key: number]: boolean } = {};
    inventoryReportDetail.forEach((_, index) => {
      initialState[index] = true;
    });
    return initialState;
  });

  const [selectedDetail, setSelectedDetail] = useState<{
    receiptCode: string;
    receiptType: 'material' | 'product';
  } | null>(null);

  const clearSelectedDetail = () => {
    setSelectedDetail(null);
  };

  const updateItemDetails = (
    index: number,
    updatedItem: InventoryReportDetailRoot
  ) => {
    const updatedDetails = [...detailsState];
    updatedDetails[index] = updatedItem;
    setDetailsState(updatedDetails);
  };

  const handleSearch = (index: number) => {
    const searchQuery = searchQueries[index]?.trim().toLowerCase();
    if (!searchQuery) return;

    const detail = detailsState[index];
    let foundReceipt: {
      receiptCode: string;
      receiptType: 'material' | 'product';
    } | null = null;

    // Search in materialPackages
    detail.materialPackages?.forEach((pkg) => {
      pkg.inventoryReportDetails.forEach((report) => {
        if (report.materialReceipt?.code.toLowerCase() === searchQuery) {
          foundReceipt = {
            receiptCode: report.materialReceipt.code,
            receiptType: 'material',
          };
        }
      });
    });

    // Search in productSizes
    detail.productSizes?.forEach((size) => {
      size.inventoryReportDetails.forEach((report: any) => {
        if (report.productReceipt?.code.toLowerCase() === searchQuery) {
          foundReceipt = {
            receiptCode: report.productReceipt.code,
            receiptType: 'product',
          };
        }
      });
    });

    if (foundReceipt) {
      setSelectedDetail(foundReceipt);
    } else {
      console.log('No matching receipt code found.');
    }
  };

  const handleInputChange = (index: number, text: string) => {
    setSearchQueries((prev) => ({ ...prev, [index]: text }));

    const searchQuery = text.trim().toLowerCase();
    const detail = detailsState[index];
    let found = false;

    detail.materialPackages?.forEach((pkg) => {
      pkg.inventoryReportDetails.forEach((report) => {
        if (report.materialReceipt?.code.toLowerCase() === searchQuery) {
          found = true;
        }
      });
    });

    detail.productSizes?.forEach((size) => {
      size.inventoryReportDetails.forEach((report: any) => {
        if (report.productReceipt?.code.toLowerCase() === searchQuery) {
          found = true;
        }
      });
    });

    setIsButtonDisabled((prev) => ({ ...prev, [index]: !text || !found }));
  };

  return (
    <View className='p-2 bg-white'>
      {detailsState.map((detail, index) => (
        <Card key={index} className='mb-4 rounded-lg shadow-sm bg-slate-100'>
          <Card.Content>
            {/* Header with Image */}
            <View className='flex flex-row justify-between items-center'>
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
              <View className='flex-1'>
                {detail?.materialVariant ? (
                  <>
                    <Text className='text-lg font-semibold text-gray-800 mb-2'>
                      Material: {detail.materialVariant.name || 'Unknown'}
                    </Text>
                    <StatusBadge className='text-sm bg-gray-600 mb-2'>
                      {detail.materialVariant.code || 'N/A'}
                    </StatusBadge>
                  </>
                ) : detail?.productVariant ? (
                  <>
                    <Text className='text-lg font-semibold text-gray-800 mb-2'>
                      Product: {detail.productVariant.name || 'Unknown'}
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

            {/* Inventory Report Details Section */}
            <View className='flex flex-row items-center justify-between mb-3'>
              <Text className='text-lg font-semibold text-gray-700'>
                Inventory Report Details
              </Text>
              <Scan size={24} color={Theme.primaryLightBackgroundColor} />
            </View>

            {/* Search Section */}
            <View className='space-y-2 mb-5 flex-row items-center gap-2'>
              <TextInput
                placeholder='Search'
                value={searchQueries[index] || ''}
                activeOutlineColor={Theme.blue[600]}
                outlineColor={Theme.blue[200]}
                onChangeText={(text) => handleInputChange(index, text)}
                mode='outlined'
                className='flex-1 bg-white'
                style={{ height: 40 }}
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
                style={{ height: 40 }}
              >
                Search
              </Button>
            </View>

            {/* Material and Product Packages */}
            <View>
              {detail.materialPackages?.map((pkg, pkgIndex) => (
                <PackagesItem
                  key={pkgIndex}
                  details={pkg.inventoryReportDetails}
                  selectedDetail={selectedDetail}
                  clearSelectedDetail={clearSelectedDetail}
                  updateDetails={(updatedDetails) => {
                    const updatedMaterialPackages = [
                      ...(detail.materialPackages || []),
                    ];
                    updatedMaterialPackages[pkgIndex].inventoryReportDetails =
                      updatedDetails;
                    updateItemDetails(index, {
                      ...detail,
                      materialPackages: updatedMaterialPackages,
                    });
                  }}
                />
              ))}
              {detail.productSizes?.map((size, sizeIndex) => (
                <PackagesItem
                  key={sizeIndex}
                  details={size.inventoryReportDetails}
                  selectedDetail={selectedDetail}
                  clearSelectedDetail={clearSelectedDetail}
                  updateDetails={(updatedDetails) => {
                    const updatedProductSizes = [
                      ...(detail.productSizes || []),
                    ];
                    updatedProductSizes[sizeIndex].inventoryReportDetails =
                      updatedDetails;
                    updateItemDetails(index, {
                      ...detail,
                      productSizes: updatedProductSizes,
                    });
                  }}
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
