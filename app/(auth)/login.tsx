import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, AlertCircle } from 'lucide-react-native';
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
  const [error, setError] = useState(null); // Error message state
  const [items, setItems] = useState([
    { label: 'Warehouse Staff', value: 'WAREHOUSE_STAFF' },
    { label: 'Inspection Staff', value: 'INSPECTION_DEPARTMENT' },
  ]);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password || !role) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios(authApi.login(email, password, role));
      const { accessToken, user } = response.data.data;
      console.log('Login Success Response:', response.data);
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      router.replace(
        role === 'WAREHOUSE_STAFF' ? '/(warehouse)/(tabs)' : '/(main)/(tabs)'
      );
    } catch (error: any) {
      const message =
        error.response?.status === 401
          ? 'Invalid email or password. Please try again.'
          : 'Login failed. Please try again later.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      {/* Modal for error display */}
      <Modal
        visible={!!error}
        animationType='fade'
        transparent={true}
        onRequestClose={() => setError(null)}
      >
        <View className='flex-1 justify-center items-center bg-black bg-opacity-50'>
          <View className='w-4/5 p-6 bg-white rounded-lg shadow-lg'>
            <View className='flex-row items-center mb-4'>
              <AlertCircle size={32} color='#DC2626' />
              <Text className='text-xl font-semibold text-red-600 ml-3'>
                Error
              </Text>
            </View>
            <Text className='text-gray-700 text-base mb-4'>{error}</Text>
            <TouchableOpacity
              className='w-full py-2 bg-blue-600 rounded-lg items-center'
              onPress={() => setError(null)}
            >
              <Text className='text-white text-lg font-semibold'>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
          containerStyle={{ marginBottom: 16 }}
          textStyle={{
            fontSize: 15,
            color: Theme.primaryLightBackgroundColor,
          }}
          labelStyle={{ fontWeight: 'bold' }}
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
              loading || !email || !password || !role
                ? 'bg-gray-400'
                : 'bg-blue-600'
            }`}
            onPress={handleLogin}
            disabled={loading || !email || !password || !role}
          >
            <Text className='text-white text-lg font-semibold'>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
