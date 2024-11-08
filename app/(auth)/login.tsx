import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff } from 'lucide-react-native';
import logo from '@/assets/images/DeliveryNoteIntro.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    console.log('Login attempted with:', { email, password });
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-1 px-6 justify-center'>
        <Text className='text-3xl font-bold text-center mb-8'>Sign In</Text>

        <Image
          source={logo}
          className='w-448 h-448 self-center mb-6'
          accessibilityLabel='Warehouse icon'
        />

        <Text className='text-xl font-semibold text-blue-600 text-center mb-8'>
          Warehouse Management{'\n'}System of Garment Factory
        </Text>

        <View className='space-y-4'>
          <View>
            <TextInput
              className='w-full h-12 px-4 border border-gray-300 rounded-lg'
              placeholder='Email'
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
              autoCapitalize='none'
              autoComplete='email'
            />
          </View>

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
