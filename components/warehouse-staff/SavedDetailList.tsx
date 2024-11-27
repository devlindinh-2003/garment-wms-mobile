import React, { FC } from 'react';
import { View, TextInput } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';

interface SavedDetailsListProps {
  savedDetails: any[];
  inputs: Record<
    string,
    {
      actualQuantity: string;
      notes: string;
      isSaved: boolean;
      isEditable: boolean;
    }
  >;
  handleInputChange: (id: string, field: string, value: string) => void;
  handleSaveDetail: (id: string) => void;
  handleEditDetail: (id: string) => void;
}

const SavedDetailsList: FC<SavedDetailsListProps> = ({
  savedDetails,
  inputs,
  handleInputChange,
  handleSaveDetail,
  handleEditDetail,
}) => {
  return (
    <>
      {savedDetails.map((detail) => (
        <Card
          key={detail.id}
          style={{
            borderWidth: 1,
            borderColor: '#e0e0e0',
            borderRadius: 10,
            marginBottom: 16,
          }}
          className='bg-white shadow-lg overflow-hidden'
        >
          <Card.Content style={{ padding: 16 }}>
            <Text className='text-lg font-bold text-gray-800 mb-2'>
              Material Receipt:{' '}
              <Text className='text-primaryLight font-bold'>
                {detail.materialReceipt?.code}
              </Text>
            </Text>
            <Text className='text-base text-gray-600 mb-4'>
              Expected Quantity:{' '}
              <Text className='font-bold'>{detail.expectedQuantity}</Text>
            </Text>
            <TextInput
              placeholder='Actual Quantity'
              value={inputs[detail.id]?.actualQuantity || ''}
              onChangeText={(value) =>
                handleInputChange(detail.id, 'actualQuantity', value)
              }
              style={{
                backgroundColor: '#f9f9f9',
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: '#e0e0e0',
              }}
              editable={inputs[detail.id]?.isEditable}
            />
            <TextInput
              placeholder='Notes'
              value={inputs[detail.id]?.notes || ''}
              onChangeText={(value) =>
                handleInputChange(detail.id, 'notes', value)
              }
              style={{
                backgroundColor: '#f9f9f9',
                borderRadius: 8,
                padding: 12,
                borderWidth: 1,
                borderColor: '#e0e0e0',
              }}
              multiline
              numberOfLines={3}
              editable={inputs[detail.id]?.isEditable}
            />
            <View className='flex-row mt-3 space-x-2 justify-end '>
              {!inputs[detail.id]?.isSaved && (
                <Button
                  mode='contained'
                  icon='send'
                  onPress={() => handleSaveDetail(detail.id)}
                  style={{ backgroundColor: '#3b82f6', borderRadius: 8 }}
                  labelStyle={{ color: '#fff' }}
                >
                  Save
                </Button>
              )}
              {inputs[detail.id]?.isSaved && (
                <Button
                  mode='outlined'
                  icon='pen'
                  onPress={() => handleEditDetail(detail.id)}
                  style={{
                    borderRadius: 8,
                    borderColor: '#3b82f6',
                  }}
                  labelStyle={{ color: '#3b82f6' }}
                >
                  Edit
                </Button>
              )}
            </View>
          </Card.Content>
        </Card>
      ))}
    </>
  );
};

export default SavedDetailsList;
