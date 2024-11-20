import { MaterialPackage } from '@/types/MaterialTypes';
import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { TextInput, Card, Button, Text } from 'react-native-paper';
import sampleImage from '@/assets/images/materialSample.png';

interface InspectingMaterialListProps {
  materials: MaterialPackage[];
}

const InspectingMaterialList: React.FC<InspectingMaterialListProps> = ({
  materials,
}) => {
  const [materialQuantities, setMaterialQuantities] = useState(
    materials.map((material) => ({
      id: material.id,
      approvedQuantity: '',
      failedQuantity: '',
    }))
  );

  const handleInputChange = (
    id: string,
    field: 'approvedQuantity' | 'failedQuantity',
    value: string
  ) => {
    setMaterialQuantities((prevQuantities) =>
      prevQuantities.map((material) =>
        material.id === id ? { ...material, [field]: value } : material
      )
    );
  };

  return (
    <View>
      {materials.map((material) => (
        <Card key={material.id} className='mb-4 rounded-lg shadow-sm'>
          {/* Material Image */}
          <Image
            source={sampleImage}
            style={{
              height: 200,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          />

          <Card.Content>
            {/* Material Name and SKU */}
            <Text variant='titleLarge' className='mt-2 font-bold'>
              {material.name}
            </Text>
            <Text className='text-gray-500'>SKU: {material.SKU}</Text>

            {/* Specification Section */}
            <View className='bg-blue-100 p-3 my-4 rounded-md'>
              <Text className='text-blue-600 font-bold mb-2'>
                Specification
              </Text>
              <View className='flex-row justify-between'>
                <Text>Height: {material.packedHeight}m</Text>
                <Text>Width: {material.packedWidth}m</Text>
              </View>
              <View className='flex-row justify-between'>
                <Text>Weight: {material.packedWeight}kg</Text>
                <Text>Length: {material.packedLength}m</Text>
              </View>
            </View>

            {/* PASS Materials */}
            <View className='bg-green-100 p-3 my-2 rounded-md'>
              <Text className='text-green-600 font-bold mb-2'>
                PASS Materials
              </Text>
              <TextInput
                mode='outlined'
                placeholder='Enter number of PASS materials'
                value={
                  materialQuantities.find((m) => m.id === material.id)
                    ?.approvedQuantity || ''
                }
                onChangeText={(text) =>
                  handleInputChange(material.id, 'approvedQuantity', text)
                }
                keyboardType='numeric'
                className='bg-white'
              />
            </View>

            {/* FAILED Materials */}
            <View className='bg-red-100 p-3 my-2 rounded-md'>
              <Text className='text-red-600 font-bold mb-2'>
                FAILED Materials
              </Text>
              <TextInput
                mode='outlined'
                placeholder='Enter number of FAILED materials'
                value={
                  materialQuantities.find((m) => m.id === material.id)
                    ?.failedQuantity || ''
                }
                onChangeText={(text) =>
                  handleInputChange(material.id, 'failedQuantity', text)
                }
                keyboardType='numeric'
                className='bg-white'
              />
            </View>
          </Card.Content>
        </Card>
      ))}

      {/* Submit Button */}
      <Button
        mode='contained'
        onPress={() => console.log('Submit report', materialQuantities)}
        className='mt-4 bg-blue-600'
        labelStyle={{ color: 'white', fontWeight: 'bold' }}
      >
        Send Report
      </Button>
    </View>
  );
};

export default InspectingMaterialList;
