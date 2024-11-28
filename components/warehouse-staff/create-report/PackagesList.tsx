import React, { useState } from 'react';
import { View, TextInput, ScrollView, Image, StyleSheet } from 'react-native';
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
  inventoryReportDetails: InventoryReportDetail[];
}

interface ProductSize {
  productSize: {
    id: string;
    name: string;
    code: string;
    size: string;
  };
  inventoryReportDetails: InventoryReportDetail[];
}

interface PackagesListProps {
  inventoryReportDetail: InventoryReportDetail[];
  onOpenCamera: (onScanComplete: (barcode: string) => void) => void;
}

// Main component
const PackagesList: React.FC<PackagesListProps> = ({
  inventoryReportDetail,
  onOpenCamera,
}) => {
  const [searchQueries, setSearchQueries] = useState<{ [id: string]: string }>(
    {}
  );
  const [searchEnabled, setSearchEnabled] = useState<{ [id: string]: boolean }>(
    {}
  );
  const [filteredPackages, setFilteredPackages] = useState<{
    [id: string]:
      | { query: string; package: MaterialPackage | ProductSize }[]
      | undefined;
  }>({});

  // Automatically set search input based on barcode scanning
  const handleBarcodeScan = (barcode: string) => {
    let query = '';

    if (barcode.startsWith('MAT-REC-')) {
      query = barcode.slice(-6); // Extract last 6 digits for material receipts
    } else if (barcode.startsWith('PRO_REC_')) {
      query = barcode.slice(-7); // Extract last 7 digits for product receipts
    }

    if (!query) return;

    // Update all relevant search inputs with the extracted query
    inventoryReportDetail.forEach((detail) => {
      const id = detail.materialVariant?.id || detail.productVariant?.id || '';
      setSearchQueries((prev) => ({ ...prev, [id]: query }));
      validateSearchQuery(id, query);
    });
  };

  // Update search query and validate against inventory data
  const handleSearchChange = (id: string, query: string) => {
    setSearchQueries((prev) => ({ ...prev, [id]: query }));
    validateSearchQuery(id, query.trim());
  };

  // Validate the search query and enable/disable the search button
  const validateSearchQuery = (id: string, query: string) => {
    const detail = inventoryReportDetail.find(
      (detail) =>
        detail.materialVariant?.id === id || detail.productVariant?.id === id
    );

    if (!detail) {
      setSearchEnabled((prev) => ({ ...prev, [id]: false }));
      return;
    }

    const isMatch =
      detail.materialPackages?.some((pkg) =>
        pkg.inventoryReportDetails.some(
          (item) => item.materialReceipt?.code === `MAT-REC-${query}`
        )
      ) ||
      detail.productSizes?.some((size) =>
        size.inventoryReportDetails.some(
          (item) => item.productReceipt?.code === `PRO_REC_${query}`
        )
      );

    const alreadyExists = filteredPackages[id]?.some(
      (pkg) => pkg.query === query
    );

    setSearchEnabled((prev) => ({ ...prev, [id]: isMatch && !alreadyExists }));
  };

  // Execute search and filter results
  const handleSearch = (id: string) => {
    const query = searchQueries[id]?.trim();
    if (!query) return;

    const detail = inventoryReportDetail.find(
      (detail) =>
        detail.materialVariant?.id === id || detail.productVariant?.id === id
    );

    if (!detail) return;

    const matchingPackages = detail.materialPackages?.filter((pkg) =>
      pkg.inventoryReportDetails.some(
        (item) => item.materialReceipt?.code === `MAT-REC-${query}`
      )
    );

    const matchingSizes = detail.productSizes?.filter((size) =>
      size.inventoryReportDetails.some(
        (item) => item.productReceipt?.code === `PRO_REC_${query}`
      )
    );

    setFilteredPackages((prev) => ({
      ...prev,
      [id]: [
        ...(prev[id] || []),
        ...(matchingPackages?.map((pkg) => ({
          query,
          package: pkg,
        })) || []),
        ...(matchingSizes?.map((size) => ({
          query,
          package: size,
        })) || []),
      ],
    }));

    setSearchEnabled((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {inventoryReportDetail.map((detail) => {
          const id =
            detail.materialVariant?.id || detail.productVariant?.id || '';
          const hasFilteredPackages = filteredPackages[id]?.length > 0;

          return (
            <Card key={id} style={styles.card}>
              {/* Card Header */}
              <View style={styles.headerContainer}>
                <View style={styles.header}>
                  <Image
                    source={{
                      uri:
                        detail.materialVariant?.image ||
                        detail.productVariant?.image ||
                        avatar,
                    }}
                    style={styles.image}
                  />
                  <View>
                    <Text style={styles.title}>
                      {detail.materialVariant?.name ||
                        detail.productVariant?.name ||
                        'Unnamed'}
                    </Text>
                    <View style={styles.codeRow}>
                      <Text style={styles.codeLabel}>Code:</Text>
                      <StatusBadge>
                        {detail.materialVariant?.code ||
                          detail.productVariant?.code ||
                          'No Code'}
                      </StatusBadge>
                    </View>
                  </View>
                </View>

                {/* QR Code Icon */}
                {/* <View>
                  <QrCode
                    size={50}
                    color={Theme.primaryDarkBackgroundColor}
                    onPress={() => onOpenCamera(handleBarcodeScan)} // Open camera
                  />
                </View> */}
              </View>

              {/* Search Section */}
              <View style={styles.searchRow}>
                <View style={styles.searchInputContainer}>
                  <Search color='gray' size={20} />
                  <TextInput
                    placeholder='Enter receipt code'
                    value={searchQueries[id] || ''}
                    onChangeText={(query) => handleSearchChange(id, query)}
                    style={styles.searchInput}
                  />
                </View>
                <Button
                  mode='contained'
                  buttonColor={Theme.primaryLightBackgroundColor}
                  onPress={() => handleSearch(id)}
                  disabled={!searchEnabled[id]}
                >
                  Add
                </Button>
              </View>

              {/* Filtered Results */}
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
                    onDetailProcessed={() => {}}
                  />
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
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

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollViewContent: {
    paddingHorizontal: 10,
  },
  card: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  codeLabel: {
    color: 'gray',
    marginRight: 5,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 5,
    paddingVertical: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  emptyText: {
    color: 'gray',
    fontSize: 14,
  },
});

export default PackagesList;
