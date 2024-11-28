import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { ScanQrCode, Search } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import PackagesItem from './PackagesItem';
import EmptyDataComponent from '@/components/common/EmptyData';
import StatusBadge from '@/components/common/StatusBadge';

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
}

const createInventoryReport = async (
  id: string,
  body: {
    details: {
      inventoryReportDetailId: string;
      actualQuantity: number;
      note: string;
    }[];
  }
) => {
  const baseUrl = 'https://garment-wms-be-1.onrender.com';
  const url = `${baseUrl}/inventory-report/${id}/record`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error('Failed to submit inventory report');
    return response.json();
  } catch (error) {
    console.error('Error submitting inventory report:', error);
    throw error;
  }
};

const PackagesList: React.FC<PackagesListProps> = ({
  inventoryReportDetail,
  reportId,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(''); // For input text
  const [filteredPackages, setFilteredPackages] = useState<
    { query: string; package: MaterialPackage }[]
  >([]);
  const [processedDetails, setProcessedDetails] = useState<
    { inventoryReportDetailId: string; actualQuantity: number; note: string }[]
  >([]);
  const [isSearchEnabled, setIsSearchEnabled] = useState<boolean>(false); // Default is disabled
  const [allReceiptsReported, setAllReceiptsReported] =
    useState<boolean>(false);

  const handleQrScan = () => {
    Alert.alert('Scan QR Code', 'QR Code scanner is not yet implemented.');
  };

  // Check if the searchQuery matches a valid receipt and does not already exist
  useEffect(() => {
    const formattedQuery = `MAT-REC-${searchQuery.trim()}`;

    // Check if the material receipt exists in the inventory
    const existsInInventory = inventoryReportDetail.some((detail) =>
      detail.materialPackages.some((pkg) =>
        pkg.inventoryReportDetails.some(
          (item) => item.materialReceipt?.code === formattedQuery
        )
      )
    );

    // Check if the material receipt already exists in the filtered list
    const existsInFiltered = filteredPackages.some(
      (item) => item.query === formattedQuery
    );

    // Enable button only if it exists in inventory and is not already in filtered list
    setIsSearchEnabled(existsInInventory && !existsInFiltered);
  }, [searchQuery, inventoryReportDetail, filteredPackages]);

  // Update the status of all receipts processed
  useEffect(() => {
    const totalReceipts = inventoryReportDetail.flatMap((detail) =>
      detail.materialPackages.flatMap((pkg) => pkg.inventoryReportDetails)
    ).length;

    const reportedReceipts = new Set(
      processedDetails.map((detail) => detail.inventoryReportDetailId)
    );

    setAllReceiptsReported(totalReceipts === reportedReceipts.size);
  }, [processedDetails, inventoryReportDetail]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearch = () => {
    const query = searchQuery.trim();
    const formattedQuery = `MAT-REC-${query}`;

    if (!query || !isSearchEnabled) {
      Alert.alert(
        'Invalid Input',
        'Please enter a valid receipt code or ensure it is not already added.'
      );
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
      setFilteredPackages((prev) => [
        ...prev,
        ...matchingPackages.map((pkg) => ({
          query: formattedQuery,
          package: pkg,
        })),
      ]);
    } else {
      Alert.alert('No Matches', 'No matching material receipt found.');
    }
  };

  const handleDetailProcessed = (detail: {
    inventoryReportDetailId: string;
    actualQuantity: number;
    note: string;
  }) => {
    setProcessedDetails((prev) => {
      const exists = prev.some(
        (item) =>
          item.inventoryReportDetailId === detail.inventoryReportDetailId
      );
      if (!exists) {
        return [...prev, detail];
      }
      return prev;
    });
  };

  const handleSubmit = async () => {
    if (processedDetails.length === 0) {
      Alert.alert(
        'Error',
        'No details processed. Complete entries before submitting.'
      );
      return;
    }

    try {
      await createInventoryReport(reportId, { details: processedDetails });
      Alert.alert('Success', 'Inventory report submitted successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit the report.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {inventoryReportDetail.map((detail) => (
          <Card key={detail.materialVariant.id} style={styles.materialCard}>
            <View style={styles.materialHeader}>
              <Image
                source={{ uri: detail.materialVariant.image }}
                style={styles.materialImage}
              />
              <View>
                <Text style={styles.materialName}>
                  {detail.materialVariant.name}
                </Text>
                <View className='flex-row items-center space-x-1'>
                  <Text style={styles.materialCode}>Code: </Text>
                  <StatusBadge className='bg-slate-500 mt-1'>
                    {detail.materialVariant.code}
                  </StatusBadge>
                </View>
              </View>
            </View>
            <View className='flex-row items-center justify-between my-3'>
              <Text style={styles.sectionTitle}>Material Packages</Text>
              <TouchableOpacity onPress={handleQrScan}>
                <ScanQrCode
                  color={Theme.primaryLightBackgroundColor}
                  size={40}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.searchRow}>
              <View style={styles.searchContainer}>
                <Search color={Theme.primaryLightBackgroundColor} size={20} />
                <TextInput
                  placeholder='Enter receipt code'
                  value={searchQuery}
                  onChangeText={handleSearchChange}
                  style={styles.searchInput}
                />
              </View>
              <Button
                mode='contained'
                onPress={handleSearch}
                buttonColor={Theme.primaryLightBackgroundColor}
                disabled={!isSearchEnabled} // Default is disabled
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
                  onDetailProcessed={handleDetailProcessed}
                />
              ))
            ) : (
              <EmptyDataComponent />
            )}
          </Card>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode='contained'
          onPress={handleSubmit}
          style={styles.submitButton}
          disabled={!allReceiptsReported}
        >
          Submit
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    padding: 10,
  },
  materialCard: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: 'white',
  },
  materialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  materialImage: {
    width: 80,
    height: 80,
    borderRadius: 25,
    marginRight: 10,
  },
  materialName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  materialCode: {
    color: 'gray',
    fontSize: 14,
  },
  reorderLevel: {
    color: Theme.primaryLightBackgroundColor,
    fontSize: 14,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 10,
  },
  searchRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  submitButton: {
    borderRadius: 8,
    width: '100%',
  },
});

export default PackagesList;
