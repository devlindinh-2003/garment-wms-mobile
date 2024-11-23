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

interface RouteProps {
  inspectedMaterialList: InspectionRequest[];
}

const initialLayout = { width: Dimensions.get('window').width };

const InspectedRoute: React.FC<RouteProps> = ({ inspectedMaterialList }) => {
  const router = useRouter();

  return (
    <ScrollView className='p-4'>
      {inspectedMaterialList.map((item) => (
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
                console.log(item?.inspectionReport?.id);
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
      ))}
    </ScrollView>
  );
};

const InspectingRoute: React.FC<RouteProps> = ({ inspectedMaterialList }) => {
  const router = useRouter();

  return (
    <ScrollView className='p-4'>
      {inspectedMaterialList.map((item) => (
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
      ))}
    </ScrollView>
  );
};

const MaterialPage: React.FC = () => {
  const { data, isSuccess, isPending } = useGetAllInspectionRequest({
    pageSize: 10,
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
      key: 'inspected',
      title: `Inspected (${inspectedMaterialList.length})`,
    },
    {
      key: 'inspecting',
      title: `Inspecting (${inspectingMaterialList.length})`,
    },
  ];

  const renderScene = SceneMap({
    inspected: () => (
      <InspectedRoute inspectedMaterialList={inspectedMaterialList} />
    ),
    inspecting: () => (
      <InspectingRoute inspectedMaterialList={inspectingMaterialList} />
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
    <PullToRefresh>
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
    </PullToRefresh>
  );
};

export default MaterialPage;
