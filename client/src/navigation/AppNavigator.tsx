import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';

import { AuthContext } from '../context/AuthContext';
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import HomeScreen from '../screens/HomeScreen';
import ChallengeDetailsScreen from '../screens/ChallengeDetailsScreen';
import ProgressTrackingScreen from '../screens/ProgressTrackingScreen';
import RecordProgressScreen from '../screens/RecordProgressScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import CreateChallengeScreen from '../screens/CreateChallengeScreen';
import { RootStackParamList } from '../types/navigationTypes';

// Create the stack navigators
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

// Placeholder screens
const ProfileScreen = () => <LoadingScreen message="Profile Screen (Coming Soon)" />;
const DiscoverScreen = () => <LoadingScreen message="Discover Screen (Coming Soon)" />;
const WalletScreen = () => <LoadingScreen message="Wallet Screen (Coming Soon)" />;

// HomeStack - for nested navigation within the Home tab
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ChallengeDetails" component={ChallengeDetailsScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="ProgressTracking" component={ProgressTrackingScreen} />
      <Stack.Screen name="RecordProgress" component={RecordProgressScreen} />
    </Stack.Navigator>
  );
};

// CreateStack - for nested navigation within the Create tab
const CreateStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreateChallenge" component={CreateChallengeScreen} />
    </Stack.Navigator>
  );
};

// Main tab navigator for authenticated users
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = 'home';
          
          if (route.name === 'HomeStack') {
            iconName = 'home';
          } else if (route.name === 'Discover') {
            iconName = 'compass';
          } else if (route.name === 'CreateStack') {
            iconName = 'plus-circle';
          } else if (route.name === 'Wallet') {
            iconName = 'wallet';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }
          
          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeStack" 
        component={HomeStack} 
        options={{ title: 'Home' }}
      />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen 
        name="CreateStack" 
        component={CreateStack}
        options={{ title: 'Create' }}
      />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Authentication stack for unauthenticated users
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
    </Stack.Navigator>
  );
};

// Main app navigator that conditionally renders auth or main screen based on login state
const AppNavigator = () => {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingScreen message="Loading..." />;
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator; 