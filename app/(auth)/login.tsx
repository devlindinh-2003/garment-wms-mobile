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
import logo from '@/assets/images/DeliveryNoteIntro.png';
import Theme from '@/constants/Theme';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Warehouse Staff', value: 'warehouse' },
    { label: 'Inspection Staff', value: 'inspection' },
  ]);
  const router = useRouter();

  const handleLogin = () => {
    if (email !== 'test' || password !== 'test') {
      Alert.alert('Error', 'Invalid email or password.');
      return;
    }
    if (!role) {
      Alert.alert('Error', 'Please select a role before logging in.');
      return;
    }

    console.log('Login successful:', { email, password, role });

    if (role === 'warehouse') {
      router.push('/(warehouse)/(tabs)');
    } else if (role === 'inspection') {
      router.push('/(main)/(tabs)');
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
          className='w-448 h-448 self-center mb-6'
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
            className='w-full h-12 bg-blue-600 rounded-lg items-center justify-center'
            onPress={handleLogin}
          >
            <Text className='text-white font-semibold text-lg'>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
