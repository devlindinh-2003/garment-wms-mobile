import React from 'react';
import { View, Dimensions } from 'react-native';
import { Card, Button } from 'react-native-paper';
import SkeletonContent from 'react-native-skeleton-content';

const screenWidth = Dimensions.get('window').width;

const InspectingItemSkeleton: React.FC = () => {
  return (
    <SkeletonContent
      isLoading={true}
      containerStyle={{
        width: screenWidth - 32,
        marginBottom: 16,
        padding: 16,
        borderRadius: 8,
      }}
      layout={[
        { width: '30%', height: 20, marginBottom: 8 }, // Code placeholder
        { width: '50%', height: 20, marginBottom: 8 }, // Status placeholder
        { width: '40%', height: 20, marginBottom: 8 }, // Date placeholder
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          children: [
            { width: '30%', height: 20, marginBottom: 8 }, // Label placeholder
            { width: '40%', height: 20, marginBottom: 8 }, // Value placeholder
          ],
        },
        {
          width: 100,
          height: 40,
          borderRadius: 8,
          alignSelf: 'flex-end',
          marginTop: 16, // Inspect button placeholder
        },
      ]}
    >
      <Card className='mb-4 rounded-xl shadow-sm border border-gray-300'>
        <Card.Content>
          <View className='flex-row justify-between mb-2'>
            <SkeletonContent
              isLoading={true}
              layout={[{ width: 80, height: 20 }]}
            />
          </View>
          <View className='flex-row justify-between mb-2'>
            <SkeletonContent
              isLoading={true}
              layout={[{ width: 120, height: 20 }]}
            />
          </View>
          <View className='flex-row justify-between mb-2'>
            <SkeletonContent
              isLoading={true}
              layout={[{ width: 100, height: 20 }]}
            />
          </View>
        </Card.Content>
        <View className='items-end px-4 py-3'>
          <SkeletonContent
            isLoading={true}
            layout={[{ width: 100, height: 40, borderRadius: 8 }]}
          />
        </View>
      </Card>
    </SkeletonContent>
  );
};

export default InspectingItemSkeleton;
