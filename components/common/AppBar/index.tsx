import { AlignJustify } from 'lucide-react-native';
import React from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import logoImg from '@/assets/images/warehouse-logo.png';

type AppBarHeaderLayoutProps = {
  toggleDrawer: () => void;
};

const AppBarHeaderLayout: React.FC<AppBarHeaderLayoutProps> = ({
  toggleDrawer,
}) => {
  return (
    <View className='bg-primaryLight flex-row justify-between items-center py-3'>
      <View className='flex-row items-center pl-3'>
        <Image source={logoImg} className='w-10 h-10 rounded-full' />
        <Text className='text-xl text-white ml-3'>FWMS</Text>
      </View>
      {/* Drawer toggle button */}
      <TouchableOpacity onPress={toggleDrawer}>
        <AlignJustify color='white' size={28} className='mr-3' />
      </TouchableOpacity>
    </View>
  );
};

export default AppBarHeaderLayout;
