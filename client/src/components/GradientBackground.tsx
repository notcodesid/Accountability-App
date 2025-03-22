import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '../config/theme';

type GradientBackgroundProps = {
  children: React.ReactNode;
  variant?: keyof typeof gradients;
  style?: ViewStyle;
};

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  variant = 'background',
  style,
}) => {
  return (
    <LinearGradient
      colors={gradients[variant]}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GradientBackground; 