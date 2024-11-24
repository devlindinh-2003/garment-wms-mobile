import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    /*  const checkLogin = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (accessToken) {
          // Redirect to the warehouse tabs if logged in
          router.replace('/(warehouse)/(tabs)');
        } else {
          // Redirect to login if no access token is found
          router.replace('/(auth)/login');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        router.replace('/(auth)/login'); // Fallback to login on error
      } finally {
        if (loaded) {
          SplashScreen.hideAsync();
        }
      }
    };

    if (loaded) {
      checkLogin();
    } */
    router.replace('/(main)/(tabs)');
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
