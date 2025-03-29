import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isLoading, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      // User is not logged in, redirect to login screen
      router.replace({
        pathname: '/onboarding/signin'
      });
    }
  }, [isLoading, isLoggedIn]);

  if (isLoading) {
    return <LoadingSpinner message="Checking login status..." />;
  }

  // If authenticated, render children
  if (isLoggedIn) {
    return <>{children}</>;
  }

  // This will briefly show before the redirect happens
  return <View />;
};

export default AuthGuard; 