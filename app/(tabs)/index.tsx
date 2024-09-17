import { StyleSheet, View } from 'react-native';
import { Card, Text } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <Card style={styles.card} status='primary'>
        <Text>Primary</Text>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 2,
  },
});
