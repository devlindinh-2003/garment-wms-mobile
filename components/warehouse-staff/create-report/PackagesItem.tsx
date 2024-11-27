import StatusBadge from '@/components/common/StatusBadge';
import Theme from '@/constants/Theme';
import { convertDate } from '@/helpers/converDate';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
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
  onCodeProcessed: (code: string) => void;
}

const PackagesItem: React.FC<PackagesItemProps> = ({
  materialPackage,
  searchQuery,
  onCodeProcessed,
}) => {
  const [inputs, setInputs] = useState<
    Record<
      string,
      { quantity: string; notes: string; isEditable: boolean; saved: boolean }
    >
  >({});

  const initializeInputState = (id: string) => {
    if (!inputs[id]) {
      setInputs((prev) => ({
        ...prev,
        [id]: { quantity: '', notes: '', isEditable: true, saved: false },
      }));
    }
  };

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

  const toggleEditSave = (id: string, code: string) => {
    const inputState = inputs[id];

    if (inputState?.isEditable) {
      // Save action
      if (!inputState.quantity || !inputState.notes) {
        Alert.alert(
          'Validation Error',
          'Both "Quantity" and "Notes" fields must be filled out before saving.'
        );
        return;
      }

      setInputs((prev) => ({
        ...prev,
        [id]: { ...prev[id], isEditable: false, saved: true },
      }));

      // Notify parent that the code has been processed
      onCodeProcessed(code);
    } else {
      // Edit action
      setInputs((prev) => ({
        ...prev,
        [id]: { ...prev[id], isEditable: true },
      }));
    }
  };

  const filteredDetails = materialPackage.inventoryReportDetails.filter(
    (detail) =>
      searchQuery && detail.materialReceipt?.code?.endsWith(searchQuery)
  );

  return (
    <Card style={{ marginTop: 10, padding: 10 }}>
      <View className='flex-row items-center justify-between'>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
          {materialPackage.materialPackage.name || 'Unnamed Package'}
        </Text>
        <StatusBadge className='bg-gray-500'>
          {materialPackage.materialPackage.code || 'No Code'}
        </StatusBadge>
      </View>

      {filteredDetails.length > 0 ? (
        filteredDetails.map((detail) => {
          // Initialize input state if not already present
          initializeInputState(detail.id);

          const isSaveDisabled =
            !inputs[detail.id]?.quantity || !inputs[detail.id]?.notes;

          const isEditDisabled =
            inputs[detail.id]?.saved &&
            inputs[detail.id]?.quantity === '' &&
            inputs[detail.id]?.notes === '';

          return (
            <View key={detail.id} style={{ marginTop: 10 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ fontWeight: 'bold' }}>Receipt Code:</Text>
                <StatusBadge className='bg-primaryLight'>
                  {detail.materialReceipt.code || 'N/A'}
                </StatusBadge>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}
              >
                <Text style={{ fontWeight: 'bold' }}>Import Date:</Text>
                <Text className='font-bold'>
                  {convertDate(detail.materialReceipt.importDate) || 'N/A'}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}
              >
                <Text style={{ fontWeight: 'bold' }}>Quantity By Pack:</Text>
                <Text className='font-bold text-lg'>
                  {detail.materialReceipt.quantityByPack || 0}
                </Text>
              </View>

              {/* Inputs for Quantity and Notes */}
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>
                  Enter Actual Quantity:
                </Text>
                <TextInput
                  placeholder='Enter quantity'
                  value={inputs[detail.id]?.quantity || ''}
                  onChangeText={(value) =>
                    handleInputChange(detail.id, 'quantity', value)
                  }
                  style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    borderRadius: 5,
                    padding: 8,
                    marginTop: 5,
                    marginBottom: 10,
                  }}
                  keyboardType='numeric'
                  editable={inputs[detail.id]?.isEditable ?? true}
                />
                <Text style={{ fontWeight: 'bold' }}>Enter Notes:</Text>
                <TextInput
                  placeholder='Enter notes'
                  value={inputs[detail.id]?.notes || ''}
                  onChangeText={(value) =>
                    handleInputChange(detail.id, 'notes', value)
                  }
                  style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    borderRadius: 5,
                    padding: 8,
                    marginTop: 5,
                  }}
                  editable={inputs[detail.id]?.isEditable ?? true}
                />
              </View>

              {/* Save/Edit Button */}
              <TouchableOpacity
                onPress={() =>
                  toggleEditSave(detail.id, detail.materialReceipt.code)
                }
                style={{
                  backgroundColor: inputs[detail.id]?.isEditable
                    ? Theme.green[500]
                    : Theme.blue[500],
                  padding: 10,
                  borderRadius: 5,
                  marginTop: 10,
                  opacity: isSaveDisabled || isEditDisabled ? 0.6 : 1,
                }}
                disabled={
                  inputs[detail.id]?.isEditable
                    ? isSaveDisabled
                    : isEditDisabled
                }
              >
                <Text style={{ color: 'white', textAlign: 'center' }}>
                  {inputs[detail.id]?.isEditable ? 'Save' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })
      ) : (
        <Text style={{ color: 'gray', marginTop: 10 }}>
          No data available. Please use the search bar to find matching data.
        </Text>
      )}
    </Card>
  );
};

export default PackagesItem;
