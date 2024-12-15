import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, createContext, useState, useContext } from 'react';
import 'react-native-reanimated';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SnackbarComponent from '@/components/common/SnackBar';

// SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

// Create Snackbar Context
const SnackbarContext = createContext({
  showSnackbar: (message: string, type: 'success' | 'error') => {},
});

// Snackbar Provider
const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>(
    'success'
  );

  const showSnackbar = (message: string, type: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <SnackbarComponent
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={() => setSnackbarVisible(false)}
        type={snackbarType}
      />
    </SnackbarContext.Provider>
  );
};

// Hook to use Snackbar
export const useSnackbar = () => useContext(SnackbarContext);

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const redirectToLogin = async () => {
      if (loaded) {
        showSnackbar('Redirecting to login page...', 'success');
        router.replace('/(auth)/login');
        await SplashScreen.hideAsync();
      }
    };
    redirectToLogin();
  }, [loaded, showSnackbar]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ApplicationProvider {...eva} theme={eva.light}>
        <ThemeProvider value={DefaultTheme}>
          <SnackbarProvider>
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
          </SnackbarProvider>
        </ThemeProvider>
      </ApplicationProvider>
    </QueryClientProvider>
  );
}
