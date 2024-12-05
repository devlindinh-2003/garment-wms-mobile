import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { Button, Card, Divider, TextInput } from 'react-native-paper';
import { InventoryReportDetailRoot } from '@/types/InventoryReport';
import StatusBadge from '@/components/common/StatusBadge';
import PackagesItem from './PackagesItem';
import Theme from '@/constants/Theme';
import { Scan } from 'lucide-react-native';
import { useSnackbar } from '@/app/_layout';

interface PackagesListProps {
  inventoryReportDetail: InventoryReportDetailRoot[];
  scannedData?: string | null;
  onScanTrigger: () => void;
  clearScannedData: () => void; // Clear scanned data callback
  onValidationChange: (isValid: boolean) => void; // Callback for validation
}

const PackagesList: React.FC<PackagesListProps> = ({
  inventoryReportDetail,
  scannedData,
  onScanTrigger,
  clearScannedData,
  onValidationChange,
}) => {
  const { showSnackbar } = useSnackbar();
  const [detailsState, setDetailsState] = useState(inventoryReportDetail);
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query state
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true); // Disable button by default
  const [selectedDetail, setSelectedDetail] = useState<{
    receiptCode: string;
    receiptType: 'material' | 'product';
    index: number;
  } | null>(null);

  const clearSelectedDetail = () => {
    setSelectedDetail(null);
    setSearchQuery('');
    clearScannedData();
  };

  const updateItemDetails = (
    index: number,
    updatedItem: InventoryReportDetailRoot
  ) => {
    const updatedDetails = [...detailsState];
    updatedDetails[index] = updatedItem;
    setDetailsState(updatedDetails);
  };

  const checkAllActualQuantities = () => {
    return detailsState.every((detail) => {
      const allMaterialPackagesValid = (detail.materialPackages || []).every(
        (pkg) =>
          (pkg.inventoryReportDetails || []).every(
            (item) => item.actualQuantity !== null
          )
      );

      const allProductSizesValid = (detail.productSizes || []).every((size) =>
        (size.inventoryReportDetails || []).every(
          (item) => item.actualQuantity !== null
        )
      );

      return allMaterialPackagesValid && allProductSizesValid;
    });
  };

  useEffect(() => {
    const isValid = checkAllActualQuantities();
    onValidationChange(isValid); // Notify parent about validation status
  }, [detailsState]);

  const checkReceiptsExist = (query: string) => {
    const searchQueryLower = query.trim().toLowerCase();
    let found = false;

    detailsState.forEach((detail) => {
      // Search in materialPackages
      detail.materialPackages?.forEach((pkg) => {
        pkg.inventoryReportDetails.forEach((report) => {
          if (report.materialReceipt?.code.toLowerCase() === searchQueryLower) {
            found = true;
          }
        });
      });

      detail.productSizes?.forEach((size) => {
        size.inventoryReportDetails.forEach((report: any) => {
          if (report.productReceipt?.code.toLowerCase() === searchQueryLower) {
            found = true;
          }
        });
      });
    });

    return found;
  };

  const handleInputChange = (text: string) => {
    setSearchQuery(text);

    // Enable the button only if the receipt exists
    const exists = checkReceiptsExist(text);
    setIsButtonDisabled(!exists);
  };

  const handleSearch = () => {
    const searchQueryLower = searchQuery.trim().toLowerCase();
    if (!searchQueryLower) {
      showSnackbar('Please enter a valid search query.', 'error');
      return;
    }

    let found = false;

    detailsState.forEach((detail, index) => {
      // Search in materialPackages
      detail.materialPackages?.forEach((pkg) => {
        pkg.inventoryReportDetails.forEach((report) => {
          if (report.materialReceipt?.code.toLowerCase() === searchQueryLower) {
            setSelectedDetail({
              receiptCode: report.materialReceipt.code,
              receiptType: 'material',
              index,
            });
            found = true;
          }
        });
      });

      // Search in productSizes
      detail.productSizes?.forEach((size) => {
        size.inventoryReportDetails.forEach((report: any) => {
          if (report.productReceipt?.code.toLowerCase() === searchQueryLower) {
            setSelectedDetail({
              receiptCode: report.productReceipt.code,
              receiptType: 'product',
              index,
            });
            found = true;
          }
        });
      });
    });

    if (!found) {
      showSnackbar(`No receipt found for "${searchQuery}".`, 'error');
    }
  };

  useEffect(() => {
    if (scannedData) {
      let found = false;

      detailsState.forEach((detail, index) => {
        // Search in materialPackages
        detail.materialPackages?.forEach((pkg) => {
          pkg.inventoryReportDetails.forEach((report) => {
            if (report.materialReceipt?.code === scannedData) {
              setSelectedDetail({
                receiptCode: scannedData,
                receiptType: 'material',
                index,
              });
              found = true;
            }
          });
        });

        // Search in productSizes
        detail.productSizes?.forEach((size) => {
          size.inventoryReportDetails.forEach((report: any) => {
            if (report.productReceipt?.code === scannedData) {
              setSelectedDetail({
                receiptCode: scannedData,
                receiptType: 'product',
                index,
              });
              found = true;
            }
          });
        });
      });

      if (!found) {
        showSnackbar(
          `Scanned code "${scannedData}" was not found in any inventory detail.`,
          'error'
        );
      } else {
        clearScannedData();
      }
    }
  }, [scannedData, detailsState]);

  return (
    <View className='p-2 bg-white'>
      {/* Search and Scan Section */}
      <View className='mb-3'>
        <View className='flex flex-row gap-2 items-center'>
          <TextInput
            placeholder='Search all inventory details'
            value={searchQuery}
            onChangeText={handleInputChange}
            mode='outlined'
            className='flex-1 bg-white mr-2'
            activeOutlineColor={Theme.blue[600]}
            outlineColor={Theme.blue[200]}
            style={{ height: 40 }}
          />
          <Button
            mode='text'
            onPress={onScanTrigger}
            className='p-2 rounded-full shadow-md bg-blue-100 ml-2'
          >
            <Scan size={24} color={Theme.primaryLightBackgroundColor} />
          </Button>
        </View>
        <Button
          icon='magnify'
          mode='contained'
          onPress={handleSearch}
          disabled={isButtonDisabled} // Disable if no matching receipts
          className='mt-3'
          buttonColor={
            isButtonDisabled
              ? Theme.gray[300]
              : Theme.primaryLightBackgroundColor
          }
          labelStyle={{
            color: isButtonDisabled ? Theme.gray[500] : 'white',
            fontWeight: 'bold',
          }}
          style={{ height: 40 }}
        >
          Search
        </Button>
      </View>

      {/* Inventory Report Details */}
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

            {/* Material and Product Packages */}
            <View>
              {detail.materialPackages?.map((pkg, pkgIndex) => (
                <PackagesItem
                  key={pkgIndex}
                  details={pkg.inventoryReportDetails}
                  selectedDetail={
                    selectedDetail?.index === index ? selectedDetail : null
                  }
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
                  selectedDetail={
                    selectedDetail?.index === index ? selectedDetail : null
                  }
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
