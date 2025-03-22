import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import ChallengeDetailsScreen from '../screens/ChallengeDetailsScreen';
import JoinChallengeScreen from '../screens/JoinChallengeScreen';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from '../screens/LoadingScreen';
import { RootStackParamList } from '../types/navigation';

// Placeholder screens - in a real app these would be implemented
const CreateChallengeScreen = () => <LoadingScreen />;
const ProfileScreen = () => <LoadingScreen />;
const ProgressTrackingScreen = () => <LoadingScreen />;
const RecordProgressScreen = () => <LoadingScreen />;
const LeaderboardScreen = () => <LoadingScreen />;
const WalletScreen = () => <LoadingScreen />;

const Stack = createNativeStackNavigator<RootStackParamList>();

// Define types for the tab navigator
type TabParamList = {
  HomeTab: undefined;
  JoinTab: undefined;
  CreateTab: undefined;
  WalletTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

// Main tab navigator for authenticated users
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4285F4',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <FontAwesome5 name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="JoinTab" 
        component={DiscoverStack} 
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <FontAwesome5 name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="CreateTab" 
        component={CreateChallengeScreen} 
        options={{
          tabBarLabel: 'Create',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <FontAwesome5 name="plus-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="WalletTab" 
        component={WalletScreen} 
        options={{
          tabBarLabel: 'Wallet',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <FontAwesome5 name="wallet" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <FontAwesome5 name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Home stack for the Home tab
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ChallengeDetails" 
        component={ChallengeDetailsScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ProgressTracking" 
        component={ProgressTrackingScreen} 
        options={{ title: 'Progress Details' }}
      />
      <Stack.Screen 
        name="RecordProgress" 
        component={RecordProgressScreen} 
        options={{ title: 'Record Progress' }}
      />
      <Stack.Screen 
        name="Leaderboard" 
        component={LeaderboardScreen} 
        options={{ title: 'Leaderboard' }}
      />
    </Stack.Navigator>
  );
};

// Discover stack for the Discover tab
const DiscoverStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="JoinChallenge" 
        component={JoinChallengeScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ChallengeDetails" 
        component={ChallengeDetailsScreen} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Auth stack - screens for unauthenticated users
const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Login" 
      component={LoginScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="VerifyEmail" 
      component={VerifyEmailScreen} 
      options={{ title: 'Verify Email' }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator; 