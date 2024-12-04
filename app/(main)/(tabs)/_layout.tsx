import { router, Tabs } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Bell, Box, Shirt, Warehouse } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AppBarHeaderLayout from '@/components/common/AppBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Drawer } from 'react-native-drawer-layout';
import avatar from '@/assets/images/avatar.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSnackbar } from '@/app/_layout';
import { Avatar } from 'react-native-paper';

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
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { showSnackbar } = useSnackbar();

  const toggleDrawer = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      showSnackbar('Logged out successfully!', 'success');
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error during logout:', error);
      showSnackbar('Failed to log out. Please try again.', 'error');
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUser();
  }, []);

  const renderDrawerContent = () => (
    <SafeAreaView className='flex-1 bg-white p-6'>
      <View className='items-center mb-6'>
        <Avatar.Image
          size={90}
          source={user?.avatarUrl ? { uri: user.avatarUrl } : avatar}
        />
        <Text className='text-2xl font-bold mt-3'>Staff Profile</Text>
      </View>

      <View className='mb-4'>
        <Text className='text-gray-700 font-semibold mb-1'>Name</Text>
        <TextInput
          value={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`}
          editable={false}
          className='border border-gray-300 p-3 rounded-md bg-gray-100 text-gray-800'
        />
      </View>
      <View className='mb-4'>
        <Text className='text-gray-700 font-semibold mb-1'>Email</Text>
        <TextInput
          value={user?.email ?? 'N/A'}
          editable={false}
          className='border border-gray-300 p-3 rounded-md bg-gray-100 text-gray-800'
        />
      </View>
      <View className='mb-4'>
        <Text className='text-gray-700 font-semibold mb-1'>Date of Birth</Text>
        <TextInput
          value={
            user?.dateOfBirth
              ? new Date(user.dateOfBirth).toLocaleDateString()
              : 'N/A'
          }
          editable={false}
          className='border border-gray-300 p-3 rounded-md bg-gray-100 text-gray-800'
        />
      </View>
      <View className='mb-4'>
        <Text className='text-gray-700 font-semibold mb-1'>Phone Number</Text>
        <TextInput
          value={user?.phoneNumber ?? 'N/A'}
          editable={false}
          className='border border-gray-300 p-3 rounded-md bg-gray-100 text-gray-800'
        />
      </View>
      <View className='mb-6'>
        <Text className='text-gray-700 font-semibold mb-1'>Staff Role</Text>
        <TextInput
          value={user?.role ?? 'Inspection Staff'}
          editable={false}
          className='border border-gray-300 p-3 rounded-md bg-gray-100 text-gray-800'
        />
      </View>
      <TouchableOpacity
        onPress={handleLogout}
        className='bg-red-600 p-3 rounded-md'
      >
        <Text className='text-white text-center font-semibold'>Sign out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderDrawerContent={renderDrawerContent}
      drawerPosition='right'
    >
      <SafeAreaView style={{ flex: 1 }}>
        <AppBarHeaderLayout toggleDrawer={toggleDrawer} />
        <View style={{ flex: 1 }}>
          <TabLayout />
        </View>
      </SafeAreaView>
    </Drawer>
  );
};

export default Layout;
