import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useState, useEffect, useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFonts } from 'expo-font';
import AnimatedSplash from '@/components/AnimatedSplash';

// Prevent native splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    'Warmongerbb': require('@/assets/fonts/warmongerbb.ttf'),
    'WinterWarmer': require('@/assets/fonts/WinterWarmer.ttf'),
    'PierceOblique': require('@/assets/fonts/PierceOblique.otf'),
    'PierceRoman': require('@/assets/fonts/PierceRoman.otf'),
    'FeatherBold': require('@/assets/fonts/FeatherBold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      setAppIsReady(true);
      // Hide native splash screen once fonts are loaded
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const onAnimationFinish = useCallback(() => {
    setShowAnimatedSplash(false);
  }, []);

  if (!appIsReady) {
    return null;
  }

  if (showAnimatedSplash) {
    return <AnimatedSplash onFinish={onAnimationFinish} />;
  }


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen 
          name="import" 
          options={{ 
            headerShown: false,
            presentation: 'transparentModal',
            animation: 'slide_from_bottom',
            contentStyle: { backgroundColor: 'transparent' }
          }} 
        />
        <Stack.Screen 
          name="deck/[deckId]" 
          options={{ 
            headerShown: false,
            presentation: 'transparentModal',
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: 'transparent' }
          }} 
        />
        <Stack.Screen 
          name="quiz/[quizId]" 
          options={{ 
            headerShown: false,
            presentation: 'transparentModal',
            animation: 'slide_from_bottom',
            contentStyle: { backgroundColor: 'transparent' }
          }} 
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
