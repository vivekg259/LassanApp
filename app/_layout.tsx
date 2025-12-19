/**
 * Screen Type: Layout
 * Owns: Root navigation structure and global providers
 * Scope: Layout
 * Reuse: Not reusable outside routing
 * 
 * NOTE: Uses Stack-only navigation. No default Tabs.
 * Custom BottomNav component handles in-app tab switching.
 */
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { LanguageProvider } from '@/src/context/LanguageContext';
import { useColorScheme } from '@/src/hooks/use-color-scheme';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <LanguageProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          <Stack.Screen name="personal-info" />
          <Stack.Screen name="security-privacy" />
          <Stack.Screen name="help-support" />
          <Stack.Screen name="delete-account" />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </LanguageProvider>
  );
}
