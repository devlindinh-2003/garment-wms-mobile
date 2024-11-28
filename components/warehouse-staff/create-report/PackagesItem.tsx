import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { Card } from 'react-native-paper';
import StatusBadge from '@/components/common/StatusBadge';
import Theme from '@/constants/Theme';
import { convertDate } from '@/helpers/converDate';

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
  onDetailProcessed: (detail: {
    inventoryReportDetailId: string;
    actualQuantity: number;
    note: string;
  }) => void;
}

const PackagesItem: React.FC<PackagesItemProps> = ({
  materialPackage,
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

  // Initialize input state for a specific item
  const initializeInputState = (id: string) => {
    if (!inputs[id]) {
      setInputs((prev) => ({
        ...prev,
        [id]: { quantity: '', notes: '', isEditable: true },
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

  const toggleEditSave = (id: string) => {
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

      // Pass the detail to the parent component
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
      // Edit action
      setInputs((prev) => ({
        ...prev,
        [id]: { ...prev[id], isEditable: true },
      }));
    }
  };

  // Filter the relevant details based on the search query
  const filteredDetails = materialPackage.inventoryReportDetails.filter(
    (detail) =>
      searchQuery && detail.materialReceipt?.code?.endsWith(searchQuery)
  );

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.packageName}>
          {materialPackage.materialPackage.name || 'Unnamed Package'}
        </Text>
        <StatusBadge className='bg-primaryLight'>
          {materialPackage.materialPackage.code || 'No Code'}
        </StatusBadge>
      </View>

      {filteredDetails.length > 0 ? (
        filteredDetails.map((detail) => {
          initializeInputState(detail.id);

          const inputState = inputs[detail.id];
          const isSaveDisabled = !inputState?.quantity || !inputState?.notes;

          return (
            <View key={detail.id} style={styles.detailContainer}>
              <View style={styles.row}>
                <Text style={styles.label}>Receipt Code:</Text>
                <StatusBadge style={styles.statusBadge}>
                  {detail.materialReceipt.code || 'N/A'}
                </StatusBadge>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Import Date:</Text>
                <Text className='font-bold'>
                  {convertDate(detail.materialReceipt.importDate) || 'N/A'}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Quantity By Pack:</Text>
                <Text className='font-bold text-lg text-red-500'>
                  {detail.materialReceipt.quantityByPack || 0}
                </Text>
              </View>

              {/* Input Fields */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Enter Actual Quantity:</Text>
                <TextInput
                  placeholder='Enter quantity'
                  value={inputState?.quantity || ''}
                  onChangeText={(value) =>
                    handleInputChange(detail.id, 'quantity', value)
                  }
                  style={styles.input}
                  keyboardType='numeric'
                  editable={inputState?.isEditable ?? true}
                />
                <Text style={styles.label}>Enter Notes:</Text>
                <TextInput
                  placeholder='Enter notes'
                  value={inputState?.notes || ''}
                  onChangeText={(value) =>
                    handleInputChange(detail.id, 'notes', value)
                  }
                  style={styles.input}
                  editable={inputState?.isEditable ?? true}
                />
              </View>

              {/* Save/Edit Button */}
              <TouchableOpacity
                onPress={() => toggleEditSave(detail.id)}
                style={[
                  styles.button,
                  {
                    backgroundColor: inputState?.isEditable
                      ? Theme.green[500]
                      : Theme.blue[500],
                  },
                ]}
                disabled={inputState?.isEditable && isSaveDisabled}
              >
                <Text style={styles.buttonText}>
                  {inputState?.isEditable ? 'Save' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })
      ) : (
        <Text style={styles.noDataText}>
          No data available. Please use the search bar to find matching data.
        </Text>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  packageName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusBadge: {
    backgroundColor: 'gray',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    color: '#fff',
  },
  detailContainer: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  value: {
    fontSize: 14,
  },
  inputContainer: {
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noDataText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 10,
  },
});

export default PackagesItem;
