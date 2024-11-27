import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { router, Tabs } from 'expo-router';
import Theme from '@/constants/Theme';
import { Warehouse } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import AppBarHeaderLayout from '@/components/common/AppBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import avatar from '@/assets/images/avatar.png';

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
    </Tabs>
  );
};

const WarehouseLayout: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const toggleDrawer = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Logged Out', 'You have been logged out successfully.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') },
      ]);
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const renderDrawerContent = () => (
    <SafeAreaView className='flex-1 bg-white p-6'>
      <View className='items-center mb-6'>
        <Image source={avatar} className='w-20 h-20 rounded-full mb-3' />
        <Text className='text-2xl font-bold'>Staff Profile</Text>
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
          value={user?.role ?? 'Warehouse Staff'}
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
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name='index' options={{}} />
          </Stack>
        </View>
      </SafeAreaView>
    </Drawer>
  );
};

export default WarehouseLayout;
