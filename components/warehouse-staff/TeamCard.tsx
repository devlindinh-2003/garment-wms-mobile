import React, { FC } from 'react';
import { View } from 'react-native';
import { Text, Card } from 'react-native-paper';
import avatar from '@/assets/images/avatar.png';
import { Image } from 'expo-image';
import { Mail, Phone, User } from 'lucide-react-native';

interface TeamCardProps {
  warehouseStaff: any;
}

const TeamCard: FC<TeamCardProps> = ({ warehouseStaff }) => {
  return (
    <Card className='bg-white rounded-xl shadow-lg overflow-hidden'>
      <Card.Content className='p-6'>
        <Text className='text-xl font-bold text-primaryDark mb-4 '>
          Warehouse Staff Information
        </Text>
        <View className='flex-row items-center justify-center '>
          <Image
            source={warehouseStaff.account.avatarUrl || avatar}
            className='w-16 h-16 rounded-full border-2 border-gray-300'
          />
          <View className='ml-4'>
            <Text className='text-xl font-semibold text-gray-800 mb-1'>
              {warehouseStaff.account.firstName}{' '}
              {warehouseStaff.account.lastName}
            </Text>
            <View className='flex-row items-center'>
              <User size={16} className='text-gray-500 mr-2' />
              <Text className='text-sm text-gray-600'>
                Username: {warehouseStaff.account.username}
              </Text>
            </View>
            <View className='flex-row items-center mt-1'>
              <Mail size={16} className='text-gray-500 mr-2' />
              <Text className='text-sm text-gray-600'>
                {warehouseStaff.account.email}
              </Text>
            </View>
            <View className='flex-row items-center mt-1'>
              <Phone size={16} className='text-gray-500 mr-2' />
              <Text className='text-sm text-gray-600'>
                Phone: {warehouseStaff.account.phoneNumber}
              </Text>
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export default TeamCard;
