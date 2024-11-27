import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { useGetAllInspectionRequest } from '@/hooks/useGetAllInspectionRequest';
import { InspectionRequest } from '@/types/InspectionRequest';
import { InspectionRequestType } from '@/enums/inspectionRequestType';
import { InspectionRequestStatus } from '@/enums/inspectionRequestStatus';
import { useRouter } from 'expo-router';
import { Button, Card, Text } from 'react-native-paper';
import { Dimensions, View } from 'react-native';
import StatusBadge from '@/components/common/StatusBadge';
import { convertDate } from '@/helpers/converDate';
import Theme from '@/constants/Theme';
import {
  NavigationState,
  SceneMap,
  SceneRendererProps,
  TabBar,
  TabView,
} from 'react-native-tab-view';
import SpinnerLoading from '@/components/common/SpinnerLoading';
import PullToRefresh from '@/components/common/PullToRefresh';
import EmptyDataComponent from '@/components/common/EmptyData';

interface RouteProps {
  inspectedProductList: InspectionRequest[];
  refreshing: boolean;
  onRefresh: () => void;
}

const initialLayout = { width: Dimensions.get('window').width };

const ProductPage = () => {
  const { data, isSuccess, isPending, refetch } = useGetAllInspectionRequest({
    pageSize: undefined,
    pageIndex: 0,
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchInspectionRequest()]);
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const refetchInspectionRequest = async () => {
    await refetch();
  };

  const inspectedProductList: InspectionRequest[] = isSuccess
    ? data?.data.filter(
        (request) =>
          request.type === InspectionRequestType.PRODUCT &&
          request.status === InspectionRequestStatus.INSPECTED
      ) || []
    : [];

  const inspectingProductList: InspectionRequest[] = isSuccess
    ? data?.data.filter(
        (request) =>
          request.type === InspectionRequestType.PRODUCT &&
          request.status === InspectionRequestStatus.INSPECTING
      ) || []
    : [];

  const [index, setIndex] = useState(0);
  const routes = [
    {
      key: 'inspected',
      title: `Inspected (${inspectedProductList.length})`,
    },
    {
      key: 'inspecting',
      title: `Inspecting (${inspectingProductList.length})`,
    },
  ];

  const InspectedRoute: React.FC<RouteProps> = ({
    inspectedProductList,
    refreshing,
    onRefresh,
  }) => {
    const router = useRouter();
    if (!inspectedProductList.length) {
      return <EmptyDataComponent />;
    }
    return (
      <PullToRefresh refreshing={refreshing} onRefresh={onRefresh}>
        <ScrollView className='p-4'>
          {inspectedProductList.map((item) => (
            <Card
              key={item.id}
              className='mb-4 rounded-xl shadow-sm border border-gray-300'
            >
              <Card.Content>
                <View className='flex-row justify-between mb-2'>
                  <Text className='text-gray-500 font-medium'>Code</Text>
                  <Text className='font-semibold text-primaryLight'>
                    {item.code}
                  </Text>
                </View>
                <View className='flex-row justify-between mb-2'>
                  <Text className='text-gray-500 font-medium'>Status</Text>
                  <StatusBadge variant='success'>{item.status}</StatusBadge>
                </View>
                <View className='flex-row justify-between mb-2'>
                  <Text className='text-gray-500 font-medium'>
                    Inspected Requested Date
                  </Text>
                  <Text className='font-semibold'>
                    {convertDate(item.createdAt || '')}
                  </Text>
                </View>
              </Card.Content>
              <View className='items-end px-4 py-3'>
                <Button
                  mode='contained'
                  icon='open-in-app'
                  onPress={() => {
                    router.push({
                      pathname: '/(main)/(tabs)/product/inspected/[id]',
                      params: { id: item?.inspectionReport?.id || '' },
                    });
                  }}
                  className='rounded-lg'
                  labelStyle={{
                    color: 'white',
                    fontWeight: '600',
                  }}
                  style={{
                    backgroundColor: Theme.primaryLightBackgroundColor,
                    minWidth: 100,
                    elevation: 2,
                  }}
                  contentStyle={{ paddingVertical: 4 }}
                >
                  View
                </Button>
              </View>
            </Card>
          ))}
        </ScrollView>
      </PullToRefresh>
    );
  };

  const InspectingRoute: React.FC<RouteProps> = ({
    inspectedProductList,
    refreshing,
    onRefresh,
  }) => {
    const router = useRouter();
    if (!inspectedProductList.length) {
      return <EmptyDataComponent />;
    }
    return (
      <PullToRefresh refreshing={refreshing} onRefresh={onRefresh}>
        <ScrollView className='p-4'>
          {inspectedProductList.map((item) => (
            <Card
              key={item.id}
              className='mb-4 rounded-xl shadow-sm border border-gray-300'
            >
              <Card.Content>
                <View className='flex-row justify-between mb-2'>
                  <Text className='text-gray-500 font-medium'>Code</Text>
                  <Text className='font-semibold text-primaryLight'>
                    {item.code}
                  </Text>
                </View>
                <View className='flex-row justify-between mb-2'>
                  <Text className='text-gray-500 font-medium'>Status</Text>
                  <StatusBadge variant='default'>{item.status}</StatusBadge>
                </View>
                <View className='flex-row justify-between mb-2'>
                  <Text className='text-gray-500 font-medium'>
                    Inspected Requested Date
                  </Text>
                  <Text className='font-semibold'>
                    {convertDate(item.createdAt || '')}
                  </Text>
                </View>
              </Card.Content>
              <View className='items-end px-4 py-3'>
                <Button
                  mode='contained'
                  icon='magnify'
                  onPress={() =>
                    router.push({
                      pathname: '/(main)/(tabs)/product/create-report/[id]',
                      params: { id: item.id },
                    })
                  }
                  className='rounded-lg'
                  labelStyle={{
                    color: 'white',
                    fontWeight: '600',
                  }}
                  style={{
                    backgroundColor: Theme.green[500],
                    minWidth: 100,
                    elevation: 2,
                  }}
                  contentStyle={{ paddingVertical: 4 }}
                >
                  Inspect
                </Button>
              </View>
            </Card>
          ))}
        </ScrollView>
      </PullToRefresh>
    );
  };

  const renderScene = SceneMap({
    inspected: () => (
      <InspectedRoute
        inspectedProductList={inspectedProductList}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    ),
    inspecting: () => (
      <InspectingRoute
        inspectedProductList={inspectingProductList}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    ),
  });

  const renderTabBar = (
    props: SceneRendererProps & {
      navigationState: NavigationState<{ key: string; title: string }>;
    }
  ) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: index === 0 ? Theme.green[500] : '#3b82f6',
      }}
      style={{ backgroundColor: 'white' }}
      activeColor={index === 0 ? Theme.green[500] : '#3b82f6'}
      inactiveColor='#9ca3af'
    />
  );

  return (
    <View className='flex-1 mb-9'>
      <Text
        style={{ fontWeight: 'bold' }}
        variant='titleLarge'
        className='text-primaryLight capitalize mb-2 text-center mt-4'
      >
        Finished Product Statistics
      </Text>
      {isPending ? (
        <SpinnerLoading />
      ) : (
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={renderTabBar}
        />
      )}
    </View>
  );
};

export default ProductPage;
