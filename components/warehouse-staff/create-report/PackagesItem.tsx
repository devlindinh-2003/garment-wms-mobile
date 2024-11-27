import React from 'react';
import { View, Text } from 'react-native';
import { Card } from 'react-native-paper';

interface MaterialReceipt {
  code: string;
  importDate: string;
  expireDate?: string;
  quantityByPack: number;
  remainQuantityByPack: number;
  status: string;
}

interface InventoryReportDetail {
  id: string;
  expectedQuantity: number;
  actualQuantity: number | null;
  managerQuantityConfirm: number | null;
  materialReceipt: MaterialReceipt;
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

interface PackagesItemProps {
  materialPackage: MaterialPackage;
  searchQuery: string;
}

const PackagesItem: React.FC<PackagesItemProps> = ({
  materialPackage,
  searchQuery,
}) => {
  const filteredDetails = materialPackage.inventoryReportDetails.filter(
    (detail) =>
      searchQuery &&
      detail.materialReceipt.code.toLowerCase() === searchQuery.toLowerCase()
  );

  return (
    <Card style={{ marginTop: 10, padding: 10 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
        {materialPackage.materialPackage.name}
      </Text>
      <Text style={{ color: 'gray' }}>
        Code: {materialPackage.materialPackage.code}
      </Text>
      <Text style={{ color: 'gray' }}>
        Unit: {materialPackage.materialPackage.packUnit}
      </Text>

      {filteredDetails.length > 0 ? (
        filteredDetails.map((detail) => (
          <View key={detail.id} style={{ marginTop: 10 }}>
            <Text>Receipt Code: {detail.materialReceipt.code}</Text>
            <Text>
              Import Date:{' '}
              {new Date(detail.materialReceipt.importDate).toLocaleDateString()}
            </Text>
            <Text>
              Expire Date:{' '}
              {detail.materialReceipt.expireDate
                ? new Date(
                    detail.materialReceipt.expireDate
                  ).toLocaleDateString()
                : 'N/A'}
            </Text>
            <Text>Quantity: {detail.materialReceipt.quantityByPack}</Text>
            <Text>
              Remaining: {detail.materialReceipt.remainQuantityByPack}
            </Text>
            <Text>Status: {detail.materialReceipt.status}</Text>
          </View>
        ))
      ) : (
        <Text style={{ color: 'gray', marginTop: 10 }}>
          No data available. Please use the search bar to find matching data.
        </Text>
      )}
    </Card>
  );
};

export default PackagesItem;
