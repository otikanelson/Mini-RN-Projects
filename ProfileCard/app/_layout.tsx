import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { UserProvider } from '@/components/ui/UserProvider';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    brillant: require('../assets/fonts/brillant.otf'),
    Carevo: require('../assets/fonts/Carevo.ttf'),
    qurovaRegular: require('../assets/fonts/qurova-regular.otf'),
    qurovaLight: require('../assets/fonts/qurova-light.otf'),
    qurovaBold: require('../assets/fonts/qurova-bold.otf'),
    qurovaMedium: require('../assets/fonts/qurova-medium.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <UserProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerStyle: {} }} />
        </Stack>
      </UserProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
