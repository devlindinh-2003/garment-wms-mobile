import { View, ScrollView } from 'react-native';
import SafeAreaLayout from '@/components/common/SafeAreaLayout';
import { Text, Card, TouchableRipple } from 'react-native-paper';
import { FC } from 'react';
import { router } from 'expo-router';

type StatusCardProps = {
  count: number;
  status: string;
  color: string;
};

const StatusCard: FC<StatusCardProps> = ({ count, status, color }) => (
  <Card className={`flex-1 mx-1 py-4 items-center ${color}`}>
    <Text className='text-2xl font-bold text-white'>{count}</Text>
    <Text className='text-xs mt-1 text-white uppercase'>{status}</Text>
  </Card>
);

type SectionHeaderProps = {
  title: string;
  total: number;
  onPress: () => void;
};

const SectionHeader: FC<SectionHeaderProps> = ({ title, total, onPress }) => (
  <View className='flex flex-row items-center justify-between my-4'>
    <View
      className='flex flex-row items-center space-x-2'
      style={{ minWidth: 180 }}
    >
      <Text variant='titleMedium' className='font-bold'>
        {title}
      </Text>
      <Card className='px-2 py-1 border border-gray-500 rounded-lg'>
        <Text className='text-gray-700'>
          Total: <Text className='font-bold'>{total}</Text>
        </Text>
      </Card>
    </View>
    <TouchableRipple onPress={onPress}>
      <Text className='text-blue-500 underline'>Details →</Text>
    </TouchableRipple>
  </View>
);

const DashboardPage: FC = () => {
  return (
    <SafeAreaLayout className='px-4 py-2'>
      <ScrollView showsVerticalScrollIndicator={false} className='space-y-6'>
        <SectionHeader
          title='Raw Material'
          total={8}
          onPress={() => {
            router.push('/material');
          }}
        />
        <View className='flex-row space-x-2'>
          <StatusCard count={2} status='Inspected' color='bg-green-500' />
          <StatusCard count={3} status='Inspecting' color='bg-blue-500' />
          <StatusCard count={3} status='Cancelled' color='bg-red-500' />
        </View>

        <SectionHeader
          title='Finished Product'
          total={11}
          onPress={() => {
            router.push('/product');
          }}
        />
        <View className='flex-row space-x-2'>
          <StatusCard count={6} status='Inspected' color='bg-green-500' />
          <StatusCard count={3} status='Inspecting' color='bg-blue-500' />
          <StatusCard count={2} status='Cancelled' color='bg-red-500' />
        </View>

        <SectionHeader
          title='Notifications'
          total={11}
          onPress={() => {
            router.push('/notification');
          }}
        />
        <View className='flex-row space-x-2'>
          <StatusCard count={6} status='Read' color='bg-green-500' />
          <StatusCard count={2} status='Unread' color='bg-gray-400' />
          <View className='flex-1 mx-1' />
        </View>
      </ScrollView>
    </SafeAreaLayout>
  );
};

export default DashboardPage;
