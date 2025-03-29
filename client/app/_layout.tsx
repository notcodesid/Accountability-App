import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import { AuthProvider } from '../context/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const colorScheme = useColorScheme() || 'light';

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/email" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/otp" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/password" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/username" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/signin" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
} 