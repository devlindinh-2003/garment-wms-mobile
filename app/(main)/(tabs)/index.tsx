import { ScrollView } from 'react-native';
import SafeAreaLayout from '@/components/common/SafeAreaLayout';
import { Text } from 'react-native-paper';
import { FC, useState } from 'react';
import { useGetInspectionStatisticByType } from '@/hooks/useGetImportRequestStatistic';
import { InspectionRequestType } from '@/enums/inspectionRequestType';
import MaterialStatistic from '@/components/material/MaterialStatistic';
import SpinnerLoading from '@/components/common/SpinnerLoading';
import PullToRefresh from '@/components/common/PullToRefresh';

const DashboardPage: FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const {
    data: materialData,
    isPending: isPendingMaterial,
    refetch: refetchMaterial,
  } = useGetInspectionStatisticByType(InspectionRequestType.MATERIAL);
  const {
    data: productData,
    isPending: isPendingProduct,
    refetch: refetchProduct,
  } = useGetInspectionStatisticByType(InspectionRequestType.PRODUCT);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchMaterial(), refetchProduct()]);
      console.log('Refresh ok');
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (isPendingMaterial || isPendingProduct) {
    return (
      <SafeAreaLayout className='flex-1 justify-center items-center'>
        <SpinnerLoading />
      </SafeAreaLayout>
    );
  }

  return (
    <PullToRefresh refreshing={refreshing} onRefresh={onRefresh}>
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
