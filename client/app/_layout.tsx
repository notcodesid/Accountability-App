import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';

export default function RootLayout() {
  const colorScheme = useColorScheme() || 'light';
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // This would normally check if the user is authenticated
  // For example, check AsyncStorage for a token
  useEffect(() => {
    // Mock authentication check
    // In a real app, you would check AsyncStorage, SecureStore, etc.
    setIsAuthenticated(false); // Set to false to show onboarding
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Onboarding/Auth flow
        <>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/email" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/password" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/username" options={{ headerShown: false }} />
        </>
      ) : (
        // Main app
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
} 