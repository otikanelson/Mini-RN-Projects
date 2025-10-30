import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFonts } from 'expo-font';

export default function RootLayout() {
  const colorScheme = useColorScheme();
   const [fontsLoaded] = useFonts({
        'Warmongerbb': require('@/assets/fonts/warmongerbb.ttf'),
        'WinterWarmer': require('@/assets/fonts/WinterWarmer.ttf'),
        'PierceOblique': require('@/assets/fonts/PierceOblique.otf'),
        'PierceRoman': require('@/assets/fonts/PierceRoman.otf'),
        'FeatherBold': require('@/assets/fonts/FeatherBold.ttf'),
      });

      if (!fontsLoaded) {
        return null;
      }


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="deck/[deckId]" options={{ headerShown: false }} />
        <Stack.Screen name="quiz/[quizId]" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
