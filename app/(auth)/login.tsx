import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff } from 'lucide-react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import logo from '@/assets/images/DeliveryNoteIntro.png';
import Theme from '@/constants/Theme';
import { authApi } from '@/api/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([
    { label: 'Warehouse Staff', value: 'WAREHOUSE_STAFF' },
    { label: 'Inspection Staff', value: 'INSPECTION_DEPARTMENT' },
  ]);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }
    if (!role) {
      Alert.alert('Error', 'Please select a role before logging in.');
      return;
    }

    setLoading(true);

    try {
      const requestBody = {
        email,
        password,
        role,
      };
      console.log('Request Body:', JSON.stringify(requestBody, null, 2));

      // Await the API call
      const response = await axios(authApi.login(email, password, role));

      // Extract necessary data
      const { accessToken, user } = response.data.data;

      // Save to AsyncStorage
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // Log the API response and stored data
      console.log('API Response:', JSON.stringify(response.data, null, 2));
      console.log('Access Token Saved:', accessToken);
      console.log('User Saved:', user);

      // Handle successful login
      Alert.alert('Success', 'Login successful!');

      if (role === 'WAREHOUSE_STAFF') {
        router.push('/warehouse/dashboard');
      } else if (role === 'INSPECTION_DEPARTMENT') {
        router.push('/inspection/dashboard');
      }
    } catch (error: any) {
      const message = ``;
      error?.message || error.response?.data?.message || 'Login failed.';
      console.error(
        'Login Error:',
        JSON.stringify(error.response?.data || error, null, 2)
      );
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-1 px-6 justify-center'>
        <Text className='text-3xl font-bold text-center mb-8 uppercase text-primaryLight'>
          Sign In
        </Text>

        <Image
          source={logo}
          className='w-40 h-40 self-center mb-6'
          accessibilityLabel='Warehouse icon'
        />

        {/* Role Dropdown Picker */}
        <DropDownPicker
          open={open}
          value={role}
          items={items}
          setOpen={setOpen}
          setValue={setRole}
          setItems={setItems}
          placeholder='Select your role'
          containerStyle={{
            marginBottom: 16,
          }}
          textStyle={{
            fontSize: 15,
            color: Theme.primaryLightBackgroundColor,
          }}
          labelStyle={{
            fontWeight: 'bold',
          }}
        />

        <View className='space-y-4'>
          {/* Email Input */}
          <TextInput
            className='w-full h-12 px-4 border border-gray-300 rounded-lg'
            placeholder='Email'
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            autoCapitalize='none'
            autoComplete='email'
          />

          {/* Password Input */}
          <View className='relative'>
            <TextInput
              className='w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg'
              placeholder='Password'
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize='none'
              autoComplete='password'
            />
            <TouchableOpacity
              className='absolute right-4 top-3'
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={24} color='#9CA3AF' />
              ) : (
                <Eye size={24} color='#9CA3AF' />
              )}
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className={`w-full h-12 rounded-lg items-center justify-center ${
              loading ? 'bg-gray-400' : 'bg-blue-600'
            }`}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className='text-white font-semibold text-lg'>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
