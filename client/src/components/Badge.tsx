import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, borderRadius, spacing, fontSize } from '../config/theme';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  label?: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
  count?: number;
  showDot?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
  count,
  showDot = false,
}) => {
  // Determine background color based on variant
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'danger':
        return colors.danger;
      case 'info':
        return colors.info;
      case 'default':
      default:
        return colors.backgroundLighter;
    }
  };

  // Determine text color based on variant
  const getTextColor = () => {
    switch (variant) {
      case 'default':
        return colors.textSecondary;
      default:
        return colors.textPrimary;
    }
  };

  // Size-based styling
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: spacing.xs / 2,
          paddingHorizontal: spacing.xs,
          fontSize: fontSize.xs,
        };
      case 'large':
        return {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          fontSize: fontSize.md,
        };
      case 'medium':
      default:
        return {
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.sm,
          fontSize: fontSize.sm,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const backgroundColor = getBackgroundColor();
  const textColor = getTextColor();

  // Just a dot with no text
  if (showDot && !label && !count) {
    return (
      <View
        style={[
          styles.dot,
          { backgroundColor },
          size === 'small' ? { width: 8, height: 8 } : size === 'large' ? { width: 14, height: 14 } : { width: 10, height: 10 },
          style,
        ]}
      />
    );
  }

  // For count-only badges
  if (count !== undefined && !label) {
    return (
      <View style={[styles.container, { backgroundColor }, style]}>
        <Text
          style={[
            styles.text,
            { fontSize: sizeStyles.fontSize, color: textColor },
            textStyle,
          ]}
        >
          {count > 99 ? '99+' : count}
        </Text>
      </View>
    );
  }

  // Standard badge with label
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        },
        style,
      ]}
    >
      {showDot && (
        <View
          style={[
            styles.inlineDot,
            { backgroundColor: 'white' },
            size === 'small' ? { width: 4, height: 4 } : size === 'large' ? { width: 8, height: 8 } : { width: 6, height: 6 },
          ]}
        />
      )}
      <Text
        style={[
          styles.text,
          { fontSize: sizeStyles.fontSize, color: textColor },
          showDot && styles.textWithDot,
          textStyle,
        ]}
      >
        {label}
        {count !== undefined ? ` ${count > 99 ? '99+' : count}` : ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.round,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start', // So it only takes up as much space as it needs
  },
  text: {
    fontWeight: '600',
  },
  textWithDot: {
    marginLeft: 4,
  },
  dot: {
    borderRadius: borderRadius.round,
  },
  inlineDot: {
    borderRadius: borderRadius.round,
    marginRight: spacing.xs,
  },
});

export default Badge; 