import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import AppBarHeaderLayout from '@/components/common/AppBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import avatar from '@/assets/images/avatar.png';
import { useSnackbar } from '@/app/_layout';
import { Avatar } from 'react-native-paper';

const WarehouseLayout: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { showSnackbar } = useSnackbar();

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      showSnackbar('You have been logged out successfully.', 'success'); // Show success snackbar
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error during logout:', error);
      showSnackbar('Failed to log out. Please try again.', 'error'); // Show error snackbar
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
        showSnackbar('Failed to load user information.', 'error'); // Show error snackbar
      }
    };

    fetchUserData();
  }, [showSnackbar]);

  const renderDrawerContent = () => (
    <SafeAreaView className='flex-1 bg-white p-6'>
      <View className='items-center mb-6'>
        <Avatar.Image
          size={90}
          source={user?.avatarUrl ? { uri: user.avatarUrl } : avatar}
        />
      </View>

      {user ? (
        <>
          <ProfileField
            label='Name'
            value={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`}
          />
          <ProfileField label='Email' value={user?.email ?? 'N/A'} />
          <ProfileField
            label='Date of Birth'
            value={
              user?.dateOfBirth
                ? new Date(user.dateOfBirth).toLocaleDateString()
                : 'N/A'
            }
          />
          <ProfileField
            label='Phone Number'
            value={user?.phoneNumber ?? 'N/A'}
          />
          <ProfileField
            label='Staff Role'
            value={user?.role ?? 'Warehouse Staff'}
          />
        </>
      ) : (
        <Text className='text-gray-500'>Loading user information...</Text>
      )}

      <TouchableOpacity
        onPress={handleLogout}
        className='bg-red-600 p-3 rounded-md'
      >
        <Text className='text-white text-center font-semibold'>Sign out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  const ProfileField = ({ label, value }: { label: string; value: string }) => (
    <View className='mb-4'>
      <Text className='text-gray-700 font-semibold mb-1'>{label}</Text>
      <TextInput
        value={value}
        editable={false}
        className='border border-gray-300 p-3 rounded-md bg-gray-100 text-gray-800'
      />
    </View>
  );

  return (
    <Drawer
      open={drawerOpen}
      onOpen={() => setDrawerOpen(true)}
      onClose={() => setDrawerOpen(false)}
      renderDrawerContent={renderDrawerContent}
      drawerPosition='right'
    >
      <SafeAreaView style={{ flex: 1 }}>
        <AppBarHeaderLayout toggleDrawer={toggleDrawer} />
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='index' options={{}} />
          </Stack>
        </View>
      </SafeAreaView>
    </Drawer>
  );
};

export default WarehouseLayout;
