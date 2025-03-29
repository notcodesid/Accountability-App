import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { OnboardingColors, HomeColors } from '../constants/Colors';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={OnboardingColors.accentColor} />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: HomeColors.background,
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: HomeColors.text,
    fontWeight: '500',
  },
});

export default LoadingSpinner; 