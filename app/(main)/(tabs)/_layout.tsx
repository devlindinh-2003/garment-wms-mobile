import { Tabs } from 'expo-router';
import React from 'react';
import { Bell, Box, Shirt, Warehouse } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { View } from 'react-native';
import AppBarHeaderLayout from '@/components/common/AppBar';
import { SafeAreaView } from 'react-native-safe-area-context';

const TabLayout: React.FC = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Theme.primaryLightBackgroundColor,
        tabBarInactiveTintColor: Theme.greyText,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => (
            <Warehouse
              size={22}
              color={
                focused ? Theme.primaryLightBackgroundColor : Theme.greyText
              }
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='material'
        options={{
          title: 'Material',
          tabBarIcon: ({ focused }) => (
            <Box
              size={22}
              color={
                focused ? Theme.primaryLightBackgroundColor : Theme.greyText
              }
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='product'
        options={{
          title: 'Product',
          tabBarIcon: ({ focused }) => (
            <Shirt
              size={22}
              color={
                focused ? Theme.primaryLightBackgroundColor : Theme.greyText
              }
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='notification'
        options={{
          title: 'Notification',
          tabBarIcon: ({ focused }) => (
            <Bell
              size={22}
              color={
                focused ? Theme.primaryLightBackgroundColor : Theme.greyText
              }
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
    </Tabs>
  );
};

const Layout: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppBarHeaderLayout />
      <View style={{ flex: 1 }}>
        <TabLayout />
      </View>
    </SafeAreaView>
  );
};

export default Layout;
