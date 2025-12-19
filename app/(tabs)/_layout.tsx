/**
 * Screen Type: Layout
 * Owns: Stack-based navigation for screens inside (tabs) group
 * Scope: Layout
 * Reuse: Not reusable outside routing
 * 
 * NOTE: Default Expo Router <Tabs> removed to prevent duplicate bottom navigation.
 * Custom BottomNav component in HomeScreen handles all tab switching.
 */
import { Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="explore" />
    </Stack>
  );
}
