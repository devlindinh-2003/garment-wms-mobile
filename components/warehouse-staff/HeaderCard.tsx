import React, { FC } from 'react';
import { View } from 'react-native';
import { Text, Card, Divider } from 'react-native-paper';
import { Calendar, UserPen } from 'lucide-react-native';
import StatusBadge from '@/components/common/StatusBadge';
import Theme from '@/constants/Theme';
import { convertDate } from '@/helpers/converDate';

interface HeaderCardProps {
  code: string;
  status: string;
  createdAt: string;
  warehouseManager?: any;
}

const HeaderCard: FC<HeaderCardProps> = ({
  code,
  status,
  createdAt,
  warehouseManager,
}) => {
  return (
    <Card className='bg-white rounded-xl shadow-lg overflow-hidden'>
      <Card.Content className='p-6'>
        <View className='flex-row justify-between items-center mb-4'>
          <View>
            <Text className='text-2xl font-bold text-primaryLight'>{code}</Text>
          </View>
          <StatusBadge variant='success' className='px-3 py-1'>
            {status}
          </StatusBadge>
        </View>
        <Divider className='my-4' />
        <View className='flex-row items-center justify-between'>
          <View className='flex-row items-center'>
            <Calendar color={Theme.primaryDarkBackgroundColor} size={18} />
            <Text className='text-sm text-gray-600 ml-2'>
              Created: {convertDate(createdAt)}
            </Text>
          </View>
          <View className='flex-row items-center'>
            <UserPen color={Theme.primaryDarkBackgroundColor} size={18} />
            <Text className='text-sm text-gray-600 ml-2'>
              Manager: {warehouseManager?.account?.firstName || 'N/A'}{' '}
              {warehouseManager?.account?.lastName || 'N/A'}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export default HeaderCard;
