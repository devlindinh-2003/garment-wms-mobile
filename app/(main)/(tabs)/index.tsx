import { ScrollView, ActivityIndicator } from 'react-native';
import SafeAreaLayout from '@/components/common/SafeAreaLayout';
import { Text, Card } from 'react-native-paper';
import { FC } from 'react';
import { useGetInspectionStatisticByType } from '@/hooks/useGetImportRequestStatistic';
import { InspectionRequestType } from '@/enums/inspectionRequestType';
import MaterialStatistic from '@/components/material/MaterialStatistic';
import SpinnerLoading from '@/components/common/SpinnerLoading';
import PullToRefresh from '@/components/common/PullToRefresh';

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

const DashboardPage: FC = () => {
  const { data: materialData, isPending: isPendingMaterial } =
    useGetInspectionStatisticByType(InspectionRequestType.MATERIAL);
  const { data: productData, isPending: isPendingProduct } =
    useGetInspectionStatisticByType(InspectionRequestType.PRODUCT);

  if (isPendingMaterial || isPendingProduct) {
    return (
      <SafeAreaLayout className='flex-1 justify-center items-center'>
        <SpinnerLoading />
      </SafeAreaLayout>
    );
  }

  return (
    <PullToRefresh>
      <SafeAreaLayout className='px-4 py-2'>
        <ScrollView showsVerticalScrollIndicator={false} className='space-y-6'>
          <Text
            variant='titleLarge'
            className='font-bold text-center mt-4 mb-2'
          >
            Raw Material Statistics
          </Text>
          <MaterialStatistic statistic={materialData?.data} />

          <Text
            variant='titleLarge'
            className='font-bold text-center mt-6 mb-2'
          >
            Finished Product Statistics
          </Text>
          <MaterialStatistic statistic={productData?.data} />
        </ScrollView>
      </SafeAreaLayout>
    </PullToRefresh>
  );
};

export default DashboardPage;
