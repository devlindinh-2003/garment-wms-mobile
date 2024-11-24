import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();
export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      router.replace('/(warehouse)/(tabs)');
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ApplicationProvider {...eva} theme={eva.light}>
        <ThemeProvider value={DefaultTheme}>
          <SafeAreaProvider>
            <Stack>
              <Stack.Screen
                name='(main)/(tabs)'
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='(auth)/login'
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='(warehouse)/(tabs)'
                options={{ headerShown: false }}
              />
              <Stack.Screen name='+not-found' />
            </Stack>
          </SafeAreaProvider>
        </ThemeProvider>
      </ApplicationProvider>
    </QueryClientProvider>
  );
}
