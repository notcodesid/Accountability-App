import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors, components, borderRadius, fontSize, gradients } from '../config/theme';
import { LinearGradient } from 'expo-linear-gradient';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'gradient';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: string;
  iconRight?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  onPress: () => void;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  icon,
  iconRight = false,
  style,
  textStyle,
  fullWidth = false,
  onPress,
  ...props
}) => {
  const getBackgroundColor = () => {
    if (disabled) return components.button.disabledBackground;
    
    switch (variant) {
      case 'primary':
        return components.button.primaryBackground;
      case 'secondary':
        return components.button.secondaryBackground;
      case 'danger':
        return colors.buttonDanger;
      case 'gradient':
        return 'transparent'; // Gradient will be handled by LinearGradient
      default:
        return components.button.primaryBackground;
    }
  };
  
  const getTextColor = () => {
    if (disabled) return components.button.disabledText;
    
    switch (variant) {
      case 'primary':
      case 'danger':
      case 'gradient':
        return components.button.primaryText;
      case 'secondary':
        return components.button.secondaryText;
      default:
        return components.button.primaryText;
    }
  };
  
  const buttonStyles = [
    styles.button,
    styles[`${size}Button`],
    { backgroundColor: getBackgroundColor() },
    fullWidth && styles.fullWidthButton,
    style,
  ];
  
  const textStyles = [
    styles.text,
    styles[`${size}Text`],
    { color: getTextColor() },
    textStyle,
  ];
  
  const iconSize = size === 'small' ? 14 : size === 'medium' ? 16 : 18;
  const iconColor = getTextColor();
  const iconMargin = iconRight ? { marginLeft: 8 } : { marginRight: 8 };
  
  const renderContent = () => (
    <>
      {isLoading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <>
          {icon && !iconRight && (
            <FontAwesome5 
              name={icon} 
              size={iconSize} 
              color={iconColor} 
              style={iconMargin} 
            />
          )}
          <Text style={textStyles}>{title}</Text>
          {icon && iconRight && (
            <FontAwesome5 
              name={icon} 
              size={iconSize} 
              color={iconColor} 
              style={iconMargin} 
            />
          )}
        </>
      )}
    </>
  );
  
  // Use LinearGradient for gradient buttons
  if (variant === 'gradient' && !disabled) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={disabled || isLoading}
        style={[styles.button, styles[`${size}Button`], { overflow: 'hidden' }, fullWidth && styles.fullWidthButton, style]}
        {...props}
      >
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientContent}
        >
          <View style={styles.buttonContent}>
            {renderContent()}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={buttonStyles}
      {...props}
    >
      <View style={styles.buttonContent}>
        {renderContent()}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthButton: {
    width: '100%',
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    height: 56,
  },
  text: {
    fontWeight: '600',
  },
  smallText: {
    fontSize: fontSize.sm,
  },
  mediumText: {
    fontSize: fontSize.md,
  },
  largeText: {
    fontSize: fontSize.lg,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
});

export default Button; 