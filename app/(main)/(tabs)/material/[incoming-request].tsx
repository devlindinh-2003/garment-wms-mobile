import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AppbarHeader from '@/components/common/AppBarHeader';
import { ScrollView } from 'react-native-gesture-handler';

const IncomingRequest = () => {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View>
      <AppbarHeader title='Incoming Request' onPress={handleBackPress} />
      <ScrollView>
        <Text>Hi</Text>
      </ScrollView>
    </View>
  );
};

export default IncomingRequest;
