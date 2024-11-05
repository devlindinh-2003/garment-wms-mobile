import { Tabs } from 'expo-router';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Bell, Box, Shirt, Warehouse } from 'lucide-react-native';
import Theme from '@/constants/Theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
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
                focused ? Colors[colorScheme ?? 'light'].tint : Theme.greyText
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
                focused ? Colors[colorScheme ?? 'light'].tint : Theme.greyText
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
                focused ? Colors[colorScheme ?? 'light'].tint : Theme.greyText
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
                focused ? Colors[colorScheme ?? 'light'].tint : Theme.greyText
              }
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
    </Tabs>
  );
}
