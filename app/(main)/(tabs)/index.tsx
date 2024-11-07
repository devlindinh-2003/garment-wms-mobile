import { Text } from 'react-native';
import SafeAreaLayout from '@/components/common/SafeAreaLayout';
import { Button } from 'react-native-paper';
import Theme from '@/constants/Theme';

export default function HomeScreen() {
  return (
    <SafeAreaLayout>
      <Text>Hi</Text>
      <Button buttonColor={Theme.primaryLightBackgroundColor} textColor='white'>
        Test login
      </Button>
    </SafeAreaLayout>
  );
}
