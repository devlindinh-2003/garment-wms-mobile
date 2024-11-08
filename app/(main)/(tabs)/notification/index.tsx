import Theme from '@/constants/Theme';
import React, { useState } from 'react';
import { Text, View, ScrollView, Dimensions } from 'react-native';
import {
  TabView,
  SceneMap,
  TabBar,
  Route,
  SceneRendererProps,
  NavigationState,
} from 'react-native-tab-view';
import {
  materialsNotifications,
  productsNotifications,
} from '@/data/notifications';

type NotificationItemProps = {
  title: string;
  description: string;
  time: string;
  read: boolean;
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  description,
  time,
  read,
}) => (
  <View className='flex-row justify-between items-start border-b border-gray-200 py-3'>
    <View>
      <Text
        className={`text-sm ${read ? 'text-gray-500' : 'font-semibold text-black'}`}
      >
        {title}
      </Text>
      <Text className='text-gray-500 text-xs mt-1'>{description}</Text>
    </View>
    <Text className='text-gray-400 text-xs'>{time}</Text>
  </View>
);

const MaterialsRoute = () => (
  <ScrollView className='p-4'>
    {materialsNotifications.map((notification, index) => (
      <NotificationItem
        key={index}
        title={notification.title}
        description={notification.description}
        time={notification.time}
        read={notification.read}
      />
    ))}
  </ScrollView>
);

const ProductsRoute = () => (
  <ScrollView className='p-4'>
    {productsNotifications.map((notification, index) => (
      <NotificationItem
        key={index}
        title={notification.title}
        description={notification.description}
        time={notification.time}
        read={notification.read}
      />
    ))}
  </ScrollView>
);

const initialLayout = { width: Dimensions.get('window').width };

type RouteProps = {
  key: string;
  title: string;
};

const NotificationPage = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState<RouteProps[]>([
    { key: 'materials', title: 'Materials' },
    { key: 'products', title: 'Products' },
  ]);

  const renderScene = SceneMap({
    materials: MaterialsRoute,
    products: ProductsRoute,
  });

  const renderTabBar = (
    props: SceneRendererProps & { navigationState: NavigationState<RouteProps> }
  ) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#3b82f6' }}
      style={{ backgroundColor: 'white' }}
      activeColor={Theme.primaryLightBackgroundColor}
      inactiveColor={Theme.greyText}
    />
  );

  return (
    <View className='flex-1'>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) => renderTabBar(props as any)}
      />
    </View>
  );
};

export default NotificationPage;
