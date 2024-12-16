import React, { useEffect, useState } from 'react';
import { ScrollView, View, Dimensions } from 'react-native';
import { useGetAllInspectionRequest } from '@/hooks/useGetAllInspectionRequest';
import { InspectionRequest } from '@/types/InspectionRequest';
import { InspectionRequestType } from '@/enums/inspectionRequestType';
import { InspectionRequestStatus } from '@/enums/inspectionRequestStatus';
import { useRouter } from 'expo-router';
import { Button, Card, Text } from 'react-native-paper';
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
import { convertDateWithTime } from '@/helpers/convertDateWithTime';
import StatusBadge from '@/components/common/StatusBadge';
import Theme from '@/constants/Theme';

interface RouteProps {
  inspectedProductList: InspectionRequest[];
  refreshing: any;
  onRefresh: any;
}

const initialLayout = { width: Dimensions.get('window').width };

const InspectedRoute: React.FC<RouteProps> = ({
  inspectedProductList,
  refreshing,
  onRefresh,
}) => {
  const router = useRouter();
  return (
    <PullToRefresh refreshing={refreshing} onRefresh={onRefresh}>
      <ScrollView className='p-4'>
        {inspectedProductList.length ? (
          inspectedProductList.map((item) => (
            <Card
              key={item.id}
              className='mb-4 rounded-xl shadow-sm border border-gray-300'
            >
              <Card.Content>
                <View className='flex-row justify-between mb-2'>
                  <Text className='text-gray-500 font-medium'>Code</Text>
                  <StatusBadge>{item.code}</StatusBadge>
                </View>
                <View className='flex-row justify-between mb-4 mt-2'>
                  <Text className='text-gray-500 font-medium'>
                    Import Request
                  </Text>
                  <Text className='font-bold text-primaryLight'>
                    {item?.importRequest?.code}
                  </Text>
                </View>
                <View className='flex-row justify-between mb-2'>
                  <Text className='text-gray-500 font-medium'>Status</Text>
                  <StatusBadge variant='success'>{item.status}</StatusBadge>
                </View>
                <View className='flex-row justify-between mb-2'>
                  <Text className='text-gray-500 font-medium'>
                    Request Inspection Date
                  </Text>
                  <Text className='font-semibold'>
                    {convertDateWithTime(item.createdAt || '')}
                  </Text>
                </View>
                {item?.finishedAt && (
                  <View className='flex-row justify-between mb-2 mt-3'>
                    <Text className='text-green-800 font-bold'>
                      Inspected Date
                    </Text>
                    <Text className='font-semibold text-green-500'>
                      {convertDateWithTime(item?.finishedAt || '')}
                    </Text>
                  </View>
                )}
              </Card.Content>
              <View className='w-full px-4 py-3'>
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
          ))
        ) : (
          <EmptyDataComponent />
        )}
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
  return (
    <PullToRefresh refreshing={refreshing} onRefresh={onRefresh}>
      <ScrollView className='p-4'>
        {inspectedProductList.length ? (
          inspectedProductList.map((item) => (
            <Card
              key={item.id}
              className='mb-4 rounded-xl shadow-sm border border-gray-300'
            >
              <Card.Content>
                <View className='flex-row justify-between mb-2'>
                  <Text className='text-gray-500 font-medium'>Code</Text>
                  <StatusBadge>{item.code}</StatusBadge>
                </View>
                <View className='flex-row justify-between mb-4 mt-2'>
                  <Text className='text-gray-500 font-medium'>
                    Import Request
                  </Text>
                  <Text className='font-bold text-primaryLight'>
                    {item?.importRequest?.code}
                  </Text>
                </View>
                <View className='flex-row justify-between mb-2'>
                  <Text className='text-gray-500 font-medium'>Status</Text>
                  <StatusBadge variant='default'>{item.status}</StatusBadge>
                </View>
                <View className='flex-row justify-between mb-2'>
                  <Text className='text-blue-800 font-bold'>
                    Request Inspection Date
                  </Text>
                  <Text className='font-semibold text-blue-800'>
                    {convertDateWithTime(item.createdAt || '')}
                  </Text>
                </View>
              </Card.Content>
              <View className='w-full px-4 py-3'>
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
          ))
        ) : (
          <EmptyDataComponent />
        )}
      </ScrollView>
    </PullToRefresh>
  );
};

const ProductPage = () => {
  const { data, isSuccess, isPending, refetch } = useGetAllInspectionRequest({
    pageSize: undefined,
    pageIndex: 0,
  });
  useEffect(() => {
    refetch();
  }, [refetch]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const inspectedProductList = isSuccess
    ? data?.data.filter(
        (request) =>
          request.type === InspectionRequestType.PRODUCT &&
          request.status === InspectionRequestStatus.INSPECTED
      ) || []
    : [];

  const inspectingProductList = isSuccess
    ? data?.data.filter(
        (request) =>
          request.type === InspectionRequestType.PRODUCT &&
          request.status === InspectionRequestStatus.INSPECTING
      ) || []
    : [];

  const [index, setIndex] = useState(0);
  const routes = [
    {
      key: 'inspecting',
      title: `Inspecting (${inspectingProductList.length})`,
    },
    {
      key: 'inspected',
      title: `Inspected (${inspectedProductList.length})`,
    },
  ];

  const renderScene = SceneMap({
    inspecting: () => (
      <InspectingRoute
        inspectedProductList={inspectingProductList}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    ),
    inspected: () => (
      <InspectedRoute
        inspectedProductList={inspectedProductList}
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
        backgroundColor: index === 0 ? Theme.blue[500] : Theme.green[500],
      }}
      style={{ backgroundColor: 'white' }}
      activeColor={index === 0 ? Theme.blue[500] : Theme.green[500]}
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
