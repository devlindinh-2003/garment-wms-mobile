import React, { useEffect, useState } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import {
  TabView,
  SceneMap,
  TabBar,
  NavigationState,
  SceneRendererProps,
} from 'react-native-tab-view';
import { Card, Text, ActivityIndicator, Button } from 'react-native-paper';
import { getWarehouseStaffInventoryReport } from '@/api/inventoryReport';
import {
  InventoryReportStatus,
  InventoryReportStatusLabels,
} from '@/enums/inventoryReportStatus';
import Theme from '@/constants/Theme';
import StatusBadge from '@/components/common/StatusBadge';
import EmptyDataComponent from '@/components/common/EmptyData';
import { router } from 'expo-router';
import PullToRefresh from '@/components/common/PullToRefresh';
import { convertDateWithTime } from '@/helpers/convertDateWithTime';

const initialLayout = { width: Dimensions.get('window').width };

const WarehouseStaffDashboard = () => {
  const [inventoryReports, setInventoryReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [index, setIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInventoryReports = async () => {
    try {
      setIsLoading(true);
      const response = await getWarehouseStaffInventoryReport({
        pageSize: 13,
        pageIndex: 0,
      });

      const filteredReports = response?.data?.data?.filter(
        (report: any) =>
          report.status === InventoryReportStatus.IN_PROGRESS ||
          report.status === InventoryReportStatus.REPORTED ||
          report.status === InventoryReportStatus.FINISHED
      );

      setInventoryReports(filteredReports || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching inventory reports:', error);
      setIsError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryReports();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInventoryReports();
    setRefreshing(false);
  };

  const renderCard = (report: any) => (
    <Card
      key={report.id}
      className='mb-4 rounded-xl shadow-lg border border-gray-300 bg-white'
    >
      <Card.Content>
        <View className='flex-row justify-between items-center mb-4'>
          <Text className='text-lg font-semibold text-primaryLight'>
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
        <View className='flex-row justify-between mb-2'>
          <Text className='text-gray-500 font-medium'>Request Date</Text>
          <Text className='font-semibold'>
            {convertDateWithTime(report.createdAt || '')}
          </Text>
        </View>
        <View className='flex-row justify-between mb-2'>
          <Text className='text-gray-500 font-medium'>Note</Text>
          <Text className='font-semibold text-gray-700'>
            {report.note || 'No note provided'}
          </Text>
        </View>
      </Card.Content>
      <View className='w-full px-4 py-3'>
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

    return (
      <PullToRefresh
        onRefresh={handleRefresh}
        refreshing={refreshing}
        contentContainerStyle={styles.refreshContainer}
      >
        {reports.length ? (
          reports.map(renderCard)
        ) : (
          <View className='flex-1 justify-center items-center'>
            <EmptyDataComponent />
          </View>
        )}
      </PullToRefresh>
    );
  };

  const ReportedRoute = () => {
    const reports = inventoryReports.filter(
      (report: any) =>
        report.status === InventoryReportStatus.REPORTED ||
        report.status === InventoryReportStatus.FINISHED
    );

    return (
      <PullToRefresh
        onRefresh={handleRefresh}
        refreshing={refreshing}
        contentContainerStyle={styles.refreshContainer}
      >
        {reports.length ? (
          reports.map(renderCard)
        ) : (
          <View className='flex-1 justify-center items-center'>
            <EmptyDataComponent />
          </View>
        )}
      </PullToRefresh>
    );
  };

  const renderScene = SceneMap({
    reported: ReportedRoute,
    inProgress: InProgressRoute,
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
            { key: 'inProgress', title: 'In Progress' },
            { key: 'reported', title: 'Reported' },
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

const styles = StyleSheet.create({
  refreshContainer: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 16,
  },
});

export default WarehouseStaffDashboard;
