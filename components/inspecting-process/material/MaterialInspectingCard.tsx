import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import { Input } from '@ui-kitten/components';

interface MaterialDetailCardProps {
  image: string;
  name: string;
  code: string;
  height: string;
  width: string;
  weight: string;
  length: string;
  total: number;
  defects: { id: string; description: string }[]; // Defects dynamically passed from API
  onUpdate: (
    pass: number,
    fail: number,
    isValid: boolean,
    defects: { defectId: string; quantityByPack: number }[]
  ) => void;
}

const MaterialInspectingCard: React.FC<MaterialDetailCardProps> = ({
  image,
  name,
  code,
  height,
  width,
  weight,
  length,
  total,
  defects,
  onUpdate,
}) => {
  const [defectQuantities, setDefectQuantities] = useState(
    defects.map((defect) => ({ ...defect, quantity: 0 }))
  );
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);

  const totalDefectQuantity = defectQuantities.reduce(
    (total, defect) => total + defect.quantity,
    0
  );

  const passQuantity = total - totalDefectQuantity;

  const handleDefectChange = (id: string, quantity: string) => {
    const sanitizedValue = quantity.replace(/[^0-9]/g, '');
    setDefectQuantities((prevDefects) =>
      prevDefects.map((defect) =>
        defect.id === id
          ? { ...defect, quantity: parseInt(sanitizedValue, 10) || 0 }
          : defect
      )
    );
  };

  const validateQuantities = () => {
    if (passQuantity < 0 || totalDefectQuantity > total) {
      setErrorMessage(
        `Total defect quantity (${totalDefectQuantity}) cannot exceed the total quantity (${total}).`
      );
      setIsValid(false);
      onUpdate(0, total, false, []);
    } else {
      const validDefects = defectQuantities
        .filter((defect) => defect.quantity > 0)
        .map((defect) => ({
          defectId: defect.id,
          quantityByPack: defect.quantity,
        }));
      setErrorMessage('');
      setIsValid(true);
      onUpdate(passQuantity, totalDefectQuantity, true, validDefects);
    }
  };

  useEffect(() => {
    validateQuantities();
  }, [totalDefectQuantity]);

  return (
    <ScrollView className='flex-1 bg-gray-100'>
      <Card className='m-4 rounded-lg shadow-md'>
        <Card.Cover source={{ uri: image }} resizeMode='contain' />

        <Card.Content className='p-4'>
          {/* Title Section */}
          <View className='flex-row justify-between items-center flex-wrap mb-4'>
            <Text className='text-lg font-bold text-black flex-1 mr-2'>
              {name}
            </Text>
            <Text className='text-gray-500 text-sm'>{code}</Text>
          </View>

          {/* Specification Section */}
          <Text className='text-lg font-semibold text-gray-700 mb-2'>
            Specification
          </Text>
          <View className='flex-row flex-wrap justify-between mb-4'>
            <View className='flex-1 mr-4'>
              <Text className='text-gray-500 text-sm'>Package Height:</Text>
              <Text className='text-black font-semibold'>{height}</Text>
            </View>
            <View className='flex-1'>
              <Text className='text-gray-500 text-sm'>Package Width:</Text>
              <Text className='text-black font-semibold'>{width}</Text>
            </View>
          </View>
          <View className='flex-row flex-wrap justify-between mb-4'>
            <View className='flex-1 mr-4'>
              <Text className='text-gray-500 text-sm'>Package Weight:</Text>
              <Text className='text-black font-semibold'>{weight}</Text>
            </View>
            <View className='flex-1'>
              <Text className='text-gray-500 text-sm'>Package Length:</Text>
              <Text className='text-black font-semibold'>{length}</Text>
            </View>
          </View>

          {/* Total Quantity Display */}
          <View className='bg-blue-100 p-3 mb-4 rounded-md'>
            <Text className='text-blue-600 font-bold text-center'>
              Total Quantity: {total}
            </Text>
          </View>

          {/* Defect Materials */}
          <View className='bg-red-100 p-3 mb-4 rounded-md'>
            <Text className='text-red-600 font-bold mb-2'>
              Defect Materials
            </Text>
            {defectQuantities.map((defect) => (
              <View key={defect.id} className='mb-4'>
                <Text className='text-gray-700 font-medium mb-1'>
                  {defect.description}
                </Text>
                <Input
                  placeholder={`Enter quantity for ${defect.description}`}
                  value={defect.quantity.toString()}
                  onChangeText={(value) => handleDefectChange(defect.id, value)}
                  keyboardType='numeric'
                  style={{ backgroundColor: 'white' }}
                  textStyle={{ color: 'black' }}
                  className='border border-gray-300 rounded-md p-2'
                />
              </View>
            ))}
            {errorMessage ? (
              <Text className='text-red-500 text-sm mt-2'>{errorMessage}</Text>
            ) : null}
          </View>

          {/* PASS Materials */}
          <View className='bg-green-100 p-3 mb-4 rounded-md'>
            <Text className='text-green-600 font-bold mb-2'>
              PASS Materials
            </Text>
            <Input
              placeholder='Calculated automatically'
              value={passQuantity.toString()}
              disabled
              style={{ backgroundColor: '#E8F5E9' }}
              textStyle={{ color: '#2E7D32' }}
              className='border border-green-300 rounded-md p-2'
            />
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default MaterialInspectingCard;
