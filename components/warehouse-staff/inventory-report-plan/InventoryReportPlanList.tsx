import React from 'react';
import { FlatList, View, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import StatusBadge from '@/components/common/StatusBadge';
import {
  InventoryReportPlanStatus,
  InventoryReportPlanStatusColors,
  InventoryReportPlanStatusLabels,
} from '@/enums/inventoryReportPlanStatus';

interface InventoryReportListProps {
  inventoryReportPlans: any[];
}

const InventoryReportPlanList: React.FC<InventoryReportListProps> = ({
  inventoryReportPlans,
}) => {
  const navigation = useNavigation();

  const renderPlan = ({ item }: any) => {
    const status = item?.status as InventoryReportPlanStatus;

    const handlePress = () => {
      // Navigation logic here
    };

    return (
      <Card className='mx-3 my-2 rounded-lg shadow-lg overflow-hidden'>
        <TouchableOpacity onPress={handlePress} className='w-full'>
          <Card.Content className='py-3 px-4'>
            <View className='flex-row items-center mb-3'>
              <Avatar.Text
                size={40}
                label={item?.title?.[0] ?? 'N/A'}
                className='bg-blue-600 mr-3'
              />
              <View>
                <Text className='text-lg font-semibold text-gray-800'>
                  {item?.title ?? 'Untitled'}
                </Text>
                <Text className='text-sm text-gray-500'>
                  Code: {item?.code ?? 'N/A'}
                </Text>
              </View>
            </View>
            <Divider className='my-2' />
            <View className='flex-row justify-between items-center'>
              <Text className='text-sm text-gray-700'>
                Type: {item?.type ?? 'Unknown'}
              </Text>
              <StatusBadge
                variant='type'
                style={{
                  backgroundColor: InventoryReportPlanStatusColors[status],
                }}
                className='px-2 py-1 rounded-md'
              >
                {InventoryReportPlanStatusLabels[status]}
              </StatusBadge>
            </View>
            <Text className='text-sm text-gray-700 mt-2'>
              From:{' '}
              {item?.from ? new Date(item.from).toLocaleDateString() : 'N/A'} -
              To: {item?.to ? new Date(item.to).toLocaleDateString() : 'N/A'}
            </Text>
          </Card.Content>
        </TouchableOpacity>
      </Card>
    );
  };

  return (
    <FlatList
      data={inventoryReportPlans ?? []}
      renderItem={renderPlan}
      keyExtractor={(item) => item?.id ?? Math.random().toString()}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
};

export default InventoryReportPlanList;
