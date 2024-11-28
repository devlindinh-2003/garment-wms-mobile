import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Card } from 'react-native-paper';
import StatusBadge from '@/components/common/StatusBadge';
import { convertDate } from '@/helpers/converDate';

interface MaterialReceipt {
  code?: string;
  importDate?: string;
  expireDate?: string;
  quantityByPack?: number;
  remainQuantityByPack?: number;
  status?: string;
}

interface ProductReceipt {
  code?: string;
  importDate?: string;
  expireDate?: string;
  quantityByUom?: number;
  remainQuantityByUom?: number;
  status?: string;
}

interface InventoryReportDetail {
  id: string;
  expectedQuantity: number;
  actualQuantity: number | null;
  managerQuantityConfirm: number | null;
  materialReceipt?: MaterialReceipt;
  productReceipt?: ProductReceipt;
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

interface PackagesItemProps {
  materialPackage?: MaterialPackage;
  productSize?: ProductSize;
  searchQuery: string;
  onDetailProcessed: (detail: {
    inventoryReportDetailId: string;
    actualQuantity: number;
    note: string;
  }) => void;
}

const PackagesItem: React.FC<PackagesItemProps> = ({
  materialPackage,
  productSize,
  searchQuery,
  onDetailProcessed,
}) => {
  const [inputs, setInputs] = useState<{
    [key: string]: {
      quantity: string;
      notes: string;
      isEditable: boolean;
    };
  }>({});

  const inventoryReportDetails =
    materialPackage?.inventoryReportDetails ||
    productSize?.inventoryReportDetails;

  useEffect(() => {
    inventoryReportDetails?.forEach((detail) => {
      setInputs((prev) => ({
        ...prev,
        [detail.id]: prev[detail.id] || {
          quantity: detail.actualQuantity?.toString() || '',
          notes: '',
          isEditable: true,
        },
      }));
    });
  }, [inventoryReportDetails]);

  const handleInputChange = (
    id: string,
    field: 'quantity' | 'notes',
    value: string
  ) => {
    setInputs((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const toggleEditSave = (id: string) => {
    const inputState = inputs[id];

    if (inputState?.isEditable) {
      if (!inputState.quantity || !inputState.notes) {
        Alert.alert(
          'Validation Error',
          'Both "Quantity" and "Notes" are required.'
        );
        return;
      }

      onDetailProcessed({
        inventoryReportDetailId: id,
        actualQuantity: Number(inputState.quantity),
        note: inputState.notes,
      });

      setInputs((prev) => ({
        ...prev,
        [id]: { ...prev[id], isEditable: false },
      }));
    } else {
      setInputs((prev) => ({
        ...prev,
        [id]: { ...prev[id], isEditable: true },
      }));
    }
  };

  const filteredDetails = inventoryReportDetails?.filter((detail) => {
    const receiptCode =
      detail.materialReceipt?.code || detail.productReceipt?.code;
    return searchQuery && receiptCode?.endsWith(searchQuery);
  });
  console.log('Produc');
  console.log(JSON.stringify(productSize, null, 2));

  return (
    <ScrollView>
      <Card className='mt-3 p-4 rounded-lg border border-gray-300 bg-white'>
        {/* Header */}
        <View className='flex-row justify-between mb-3'>
          <Text className='font-bold text-lg'>
            {materialPackage?.materialPackage?.name ||
              productSize?.productSize?.name ||
              productSize?.productVariant?.name ||
              'Unnamed'}
          </Text>
        </View>

        {/* Filtered Details */}
        {filteredDetails && filteredDetails.length > 0 ? (
          filteredDetails.map((detail) => {
            const inputState = inputs[detail.id];
            const isSaveDisabled = !inputState?.quantity || !inputState?.notes;

            const receipt = detail.materialReceipt || detail.productReceipt;

            return (
              <View key={detail.id} className='mt-3'>
                <View className='flex-row justify-between mb-2'>
                  <Text className='font-semibold'>Receipt Code:</Text>
                  <StatusBadge>{receipt?.code || 'N/A'}</StatusBadge>
                </View>
                <View className='flex-row justify-between mb-2'>
                  <Text className='font-semibold'>Import Date:</Text>
                  <Text>{convertDate(receipt?.importDate) || 'N/A'}</Text>
                </View>
                <View className='flex-row justify-between mb-2'>
                  <Text className='font-semibold'>Quantity:</Text>
                  <Text className='text-red-500 font-bold'>
                    {receipt?.quantityByPack || receipt?.quantityByUom || 0}
                  </Text>
                </View>

                {/* Input Fields */}
                <View className='mt-3'>
                  <Text className='font-semibold'>Enter Actual Quantity:</Text>
                  <TextInput
                    placeholder='Enter quantity'
                    value={inputState?.quantity || ''}
                    onChangeText={(value) =>
                      handleInputChange(detail.id, 'quantity', value)
                    }
                    className='border border-gray-400 rounded px-3 py-2 mt-1'
                    keyboardType='numeric'
                    editable={inputState?.isEditable ?? true}
                  />
                  <Text className='font-semibold mt-3'>Enter Notes:</Text>
                  <TextInput
                    placeholder='Enter notes'
                    value={inputState?.notes || ''}
                    onChangeText={(value) =>
                      handleInputChange(detail.id, 'notes', value)
                    }
                    className='border border-gray-400 rounded px-3 py-2 mt-1'
                    editable={inputState?.isEditable ?? true}
                  />
                </View>

                {/* Save/Edit Button */}
                <TouchableOpacity
                  onPress={() => toggleEditSave(detail.id)}
                  className={`mt-3 px-4 py-2 rounded ${
                    inputState?.isEditable
                      ? isSaveDisabled
                        ? 'bg-gray-300'
                        : 'bg-green-500'
                      : 'bg-blue-500'
                  }`}
                  disabled={inputState?.isEditable && isSaveDisabled}
                >
                  <Text className='text-white font-bold text-center'>
                    {inputState?.isEditable ? 'Save' : 'Edit'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <Text className='text-center text-gray-500 mt-3'>
            No data available. Please use the search bar to find matching data.
          </Text>
        )}
      </Card>
    </ScrollView>
  );
};

export default PackagesItem;
