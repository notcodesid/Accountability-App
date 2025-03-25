import React, { ReactNode } from 'react';
import { View, StyleSheet, ScrollView, ViewStyle, ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingColors } from '../constants/Colors';

interface SafeScreenViewProps extends ScrollViewProps {
  children: ReactNode;
  scrollable?: boolean;
  backgroundColor?: string;
  style?: ViewStyle;
}

export default function SafeScreenView({
  children,
  scrollable = true,
  backgroundColor = OnboardingColors.background,
  style,
  ...scrollViewProps
}: SafeScreenViewProps) {
  const insets = useSafeAreaInsets();

  const containerStyle = {
    ...styles.container,
    backgroundColor,
    ...style,
  };

  const contentContainerStyle = {
    paddingTop: insets.top,
    ...scrollViewProps.contentContainerStyle,
  };

  if (scrollable) {
    return (
      <ScrollView
        style={containerStyle}
        contentContainerStyle={contentContainerStyle}
        {...scrollViewProps}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[containerStyle, { paddingTop: insets.top }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 