import { View, ScrollView } from 'react-native';
import SafeAreaLayout from '@/components/common/SafeAreaLayout';
import { Text, Card, TouchableRipple } from 'react-native-paper';
import { FC } from 'react';
import { router } from 'expo-router';
import { useGetInspectionStatisticByType } from '@/hooks/useGetImportRequestStatistic';
import { InspectionRequestType } from '@/enums/inspectionRequestType';
import MaterialStatistic from '@/components/material/MaterialStatistic';

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
  const { data: materialData } = useGetInspectionStatisticByType(
    InspectionRequestType.MATERIAL
  );
  const { data: productData } = useGetInspectionStatisticByType(
    InspectionRequestType.PRODUCT
  );

  return (
    <SafeAreaLayout className='px-4 py-2'>
      <ScrollView showsVerticalScrollIndicator={false} className='space-y-6'>
        <Text variant='titleLarge' className='font-bold text-center mt-4 mb-2'>
          Raw Material Statistics
        </Text>
        <MaterialStatistic statistic={materialData?.data} />

        <Text variant='titleLarge' className='font-bold text-center mt-6 mb-2'>
          Finished Product Statistics
        </Text>
        <MaterialStatistic statistic={productData?.data} />
      </ScrollView>
    </SafeAreaLayout>
  );
};

export default DashboardPage;
