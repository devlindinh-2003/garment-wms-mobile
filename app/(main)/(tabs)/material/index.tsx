import React, { useState } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import {
  TabView,
  SceneMap,
  TabBar,
  NavigationState,
  SceneRendererProps,
} from 'react-native-tab-view';
import { Text, Card, Button } from 'react-native-paper';
import { useGetAllInspectionRequest } from '@/hooks/useGetAllInspectionRequest';
import { InspectionRequestType } from '@/enums/inspectionRequestType';
import { InspectionRequestStatus } from '@/enums/inspectionRequestStatus';
import { InspectionRequest } from '@/types/InspectionRequest';
import Theme from '@/constants/Theme';
import { useRouter } from 'expo-router';
import { convertDate } from '@/helpers/converDate';
import StatusBadge from '@/components/common/StatusBadge';
import SpinnerLoading from '@/components/common/SpinnerLoading';
import PullToRefresh from '@/components/common/PullToRefresh';
import { convertDateWithTime } from '@/helpers/convertDateWithTime';
import EmptyDataComponent from '@/components/common/EmptyData';
import { ImportRequestStatus } from '@/enums/importRequestStatus';

interface RouteProps {
  inspectedMaterialList: InspectionRequest[];
  refreshing: any;
  onRefresh: any;
}

const initialLayout = { width: Dimensions.get('window').width };

const InspectedRoute: React.FC<RouteProps> = ({
  inspectedMaterialList,
  refreshing,
  onRefresh,
}) => {
  const router = useRouter();
  return (
    <PullToRefresh refreshing={refreshing} onRefresh={onRefresh}>
      <ScrollView className='p-4'>
        {inspectedMaterialList.length ? (
          inspectedMaterialList.map((item) => (
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
                  <Text
                    className={`font-bold ${
                      item?.importRequest?.status ===
                      ImportRequestStatus.REJECTED
                        ? 'text-red-600'
                        : 'text-primaryLight'
                    }`}
                  >
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
                    <Text className='font-semibold text-green-600'>
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
                      pathname: '/(main)/(tabs)/material/inspected/[id]',
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
  inspectedMaterialList,
  refreshing,
  onRefresh,
}) => {
  const router = useRouter();
  return (
    <PullToRefresh refreshing={refreshing} onRefresh={onRefresh}>
      <ScrollView className='p-4'>
        {inspectedMaterialList.length ? (
          inspectedMaterialList.map((item) => (
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
                      pathname: '/(main)/(tabs)/material/create-report/[id]',
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

const MaterialPage: React.FC = () => {
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
  const { data, isSuccess, isPending, refetch } = useGetAllInspectionRequest({
    pageSize: undefined,
    pageIndex: 0,
  });

  const inspectedMaterialList: InspectionRequest[] = isSuccess
    ? data?.data.filter(
        (request) =>
          request.type === InspectionRequestType.MATERIAL &&
          request.status === InspectionRequestStatus.INSPECTED
      ) || []
    : [];

  const inspectingMaterialList: InspectionRequest[] = isSuccess
    ? data?.data.filter(
        (request) =>
          request.type === InspectionRequestType.MATERIAL &&
          request.status === InspectionRequestStatus.INSPECTING
      ) || []
    : [];

  const [index, setIndex] = useState(0);
  const routes = [
    {
      key: 'inspecting',
      title: `Inspecting (${inspectingMaterialList.length})`,
    },
    {
      key: 'inspected',
      title: `Inspected (${inspectedMaterialList.length})`,
    },
  ];

  const renderScene = SceneMap({
    inspecting: () => (
      <InspectingRoute
        inspectedMaterialList={inspectingMaterialList}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    ),
    inspected: () => (
      <InspectedRoute
        inspectedMaterialList={inspectedMaterialList}
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
        Raw Material Statistics
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

export default MaterialPage;
