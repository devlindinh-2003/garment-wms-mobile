import SafeAreaLayout from '@/components/common/SafeAreaLayout';
import { Text } from 'react-native';
import { Appbar } from 'react-native-paper';
export default function HomeScreen() {
  return (
    <SafeAreaLayout>
      <Appbar.Header className='bg-primaryLight'>
        <Appbar.Content title='FWMS' />
      </Appbar.Header>
      <Text>Hi</Text>
    </SafeAreaLayout>
  );
}
