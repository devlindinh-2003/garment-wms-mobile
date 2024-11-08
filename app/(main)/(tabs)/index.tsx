import { Text } from 'react-native';
import SafeAreaLayout from '@/components/common/SafeAreaLayout';
import { Button } from 'react-native-paper';
import Theme from '@/constants/Theme';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaLayout>
      <Text>Hi</Text>
    </SafeAreaLayout>
  );
}
