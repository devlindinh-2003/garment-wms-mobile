import React, { useEffect, useState } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import {
  TabView,
  SceneMap,
  TabBar,
  NavigationState,
  SceneRendererProps,
} from 'react-native-tab-view';
import {
  Card,
  Text,
  ActivityIndicator,
  Button,
  Avatar,
} from 'react-native-paper';
import { getWarehouseStaffInventoryReport } from '@/api/inventoryReport';
import {
  InventoryReportStatus,
  InventoryReportStatusLabels,
} from '@/enums/inventoryReportStatus';
import Theme from '@/constants/Theme';
import StatusBadge from '@/components/common/StatusBadge';
import EmptyDataComponent from '@/components/common/EmptyData';
import { convertDate } from '@/helpers/converDate';
import { router } from 'expo-router';

const initialLayout = { width: Dimensions.get('window').width };

const WarehouseStaffDashboard = () => {
  const [inventoryReports, setInventoryReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchInventoryReports = async () => {
      try {
        const response = await getWarehouseStaffInventoryReport({
          pageSize: 13,
          pageIndex: 0,
        });

        const filteredReports = response?.data?.data?.filter(
          (report) =>
            report.status === InventoryReportStatus.IN_PROGRESS ||
            report.status === InventoryReportStatus.REPORTED
        );

        setInventoryReports(filteredReports || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching inventory reports:', error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchInventoryReports();
  }, []);

  const renderCard = (report: any) => (
    <Card
      key={report.id}
      className='mb-4 rounded-xl shadow-lg border border-gray-300 bg-white'
    >
      <Card.Content>
        <View className='flex-row justify-between items-center mb-4'>
          <Text className='text-lg font-semibold text-gray-800'>
            {report.code}
          </Text>
          <StatusBadge
            variant={
              report.status === InventoryReportStatus.REPORTED
                ? 'success'
                : 'default'
            }
          >
            {InventoryReportStatusLabels[report.status]}
          </StatusBadge>
        </View>

        <View className='flex-row items-center mb-2'>
          <Text className='text-gray-500 font-medium'>Created At:</Text>
          <Text className='ml-2 text-gray-700'>
            {convertDate(report.createdAt)}
          </Text>
        </View>
        <View className='flex-row items-center'>
          <Text className='text-gray-500 font-medium'>Note:</Text>
          <Text className='ml-2 text-gray-700'>
            {report.note || 'No note provided'}
          </Text>
        </View>
      </Card.Content>
      <View className='items-end px-4 py-3'>
        <Button
          mode='contained'
          icon={
            report.status === InventoryReportStatus.REPORTED
              ? 'eye'
              : 'progress-clock'
          }
          onPress={() => {
            router.push({
              pathname:
                report.status === InventoryReportStatus.IN_PROGRESS
                  ? '/(warehouse)/(tabs)/create-report/[id]'
                  : '/(warehouse)/(tabs)/reported/[id]',
              params: { id: report.id },
            });
          }}
          className='rounded-lg'
          labelStyle={{
            color: 'white',
            fontWeight: '600',
          }}
          style={{
            backgroundColor:
              report.status === InventoryReportStatus.IN_PROGRESS
                ? Theme.green[500]
                : Theme.primaryLightBackgroundColor,
            minWidth: 100,
            elevation: 2,
          }}
          contentStyle={{ paddingVertical: 4 }}
        >
          {report.status === InventoryReportStatus.IN_PROGRESS
            ? 'Start'
            : 'View'}
        </Button>
      </View>
    </Card>
  );

  const InProgressRoute = () => {
    const reports = inventoryReports.filter(
      (report) => report.status === InventoryReportStatus.IN_PROGRESS
    );

    if (!reports.length) {
      return (
        <View className='flex-1 justify-center items-center'>
          <EmptyDataComponent />
        </View>
      );
    }

    return <ScrollView className='p-4'>{reports.map(renderCard)}</ScrollView>;
  };

  const ReportedRoute = () => {
    const reports = inventoryReports.filter(
      (report) => report.status === InventoryReportStatus.REPORTED
    );

    if (!reports.length) {
      return (
        <View className='flex-1 justify-center items-center bg-white'>
          <EmptyDataComponent />
        </View>
      );
    }

    return <ScrollView className='p-4'>{reports.map(renderCard)}</ScrollView>;
  };

  const renderScene = SceneMap({
    inProgress: InProgressRoute,
    reported: ReportedRoute,
  });

  const renderTabBar = (
    props: SceneRendererProps & {
      navigationState: NavigationState<{ key: string; title: string }>;
    }
  ) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: Theme.primaryLightBackgroundColor }}
      style={{ backgroundColor: 'white' }}
      activeColor={Theme.primaryLightBackgroundColor}
      inactiveColor='#9ca3af'
    />
  );

  if (isLoading) {
    return (
      <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size='large' color='#0000ff' />
        <Text>Loading Inventory Reports...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className='flex-1 justify-center items-center'>
        <Text className='text-red-500'>Failed to load inventory reports.</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-gray-100'>
      <Text
        className='text-2xl font-bold mb-4 text-center text-primaryLight'
        style={{ marginTop: 16 }}
      >
        Inventory Reports
      </Text>
      <TabView
        navigationState={{
          index,
          routes: [
            { key: 'reported', title: 'Reported' },
            { key: 'inProgress', title: 'In Progress' },
          ],
        }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

export default WarehouseStaffDashboard;
