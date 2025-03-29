import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { OnboardingColors, HomeColors } from '../constants/Colors';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <View style={styles.overlayContainer}>
      <ActivityIndicator size="large" color={OnboardingColors.accentColor} />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
});

export default LoadingSpinner;