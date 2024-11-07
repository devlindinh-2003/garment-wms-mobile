import { Tabs } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Bell, Box, Shirt, Warehouse } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AppBarHeaderLayout from '@/components/common/AppBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Drawer } from 'react-native-drawer-layout';
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
      {/* Your tabs */}
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
      {/* Additional screens */}
    </Tabs>
  );
};

const Layout: React.FC = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const renderDrawerContent = () => (
    <SafeAreaView className='flex-1 bg-white p-6'>
      {/* Profile Header */}
      <View className='items-center mb-6'>
        <Image source={avatar} className='w-20 h-20 rounded-full mb-3' />
        <Text className='text-2xl font-bold'>Staff Profile</Text>
      </View>

      {/* Profile Information Fields */}
      <View className='mb-4'>
        <Text className='text-gray-700 font-semibold mb-1'>Name</Text>
        <TextInput
          value='Nguyen Huy Long'
          editable={false}
          className='border border-gray-300 p-3 rounded-md bg-gray-100 text-gray-800'
        />
      </View>
      <View className='mb-4'>
        <Text className='text-gray-700 font-semibold mb-1'>Email</Text>
        <TextInput
          value='huylong2003@gmail.com'
          editable={false}
          className='border border-gray-300 p-3 rounded-md bg-gray-100 text-gray-800'
        />
      </View>
      <View className='mb-4'>
        <Text className='text-gray-700 font-semibold mb-1'>Date of Birth</Text>
        <TextInput
          value='19/04/2003'
          editable={false}
          className='border border-gray-300 p-3 rounded-md bg-gray-100 text-gray-800'
        />
      </View>
      <View className='mb-4'>
        <Text className='text-gray-700 font-semibold mb-1'>Phone Number</Text>
        <TextInput
          value='01662255761'
          editable={false}
          className='border border-gray-300 p-3 rounded-md bg-gray-100 text-gray-800'
        />
      </View>
      <View className='mb-6'>
        <Text className='text-gray-700 font-semibold mb-1'>Staff Role</Text>
        <TextInput
          value='Inspection Staff'
          editable={false}
          className='border border-gray-300 p-3 rounded-md bg-gray-100 text-gray-800'
        />
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity
        onPress={toggleDrawer}
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
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Pass toggleDrawer as a prop to AppBarHeaderLayout */}
        <AppBarHeaderLayout toggleDrawer={toggleDrawer} />
        <View style={{ flex: 1 }}>
          <TabLayout />
        </View>
      </SafeAreaView>
    </Drawer>
  );
};

export default Layout;
