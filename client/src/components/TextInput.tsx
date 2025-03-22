import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  View,
  Text,
  TextInputProps as RNTextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors, components, spacing, fontSize, borderRadius } from '../config/theme';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  touched?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  isPassword?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  touched,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  isPassword,
  secureTextEntry,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isError = error && touched;
  
  const handleFocus = () => {
    setIsFocused(true);
    if (props.onFocus) {
      props.onFocus(null as any);
    }
  };
  
  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Determine the border color based on error and focus state
  const getBorderColor = () => {
    if (isError) return components.input.errorBorder;
    if (isFocused) return components.input.focusedBorder;
    return components.input.border;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        { borderColor: getBorderColor() },
        isFocused && styles.focusedInputContainer,
        isError && styles.errorInputContainer,
      ]}>
        {leftIcon && (
          <FontAwesome5
            name={leftIcon}
            size={16}
            color={isError ? components.input.errorText : components.input.icon}
            style={styles.leftIcon}
          />
        )}
        
        <RNTextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || isPassword) && styles.inputWithRightIcon,
            isError && styles.errorInput,
            inputStyle,
          ]}
          placeholderTextColor={components.input.placeholder}
          secureTextEntry={isPassword ? !passwordVisible : secureTextEntry}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        
        {isPassword && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={togglePasswordVisibility}
          >
            <FontAwesome5
              name={passwordVisible ? 'eye-slash' : 'eye'}
              size={16}
              color={components.input.icon}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !isPassword && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            <FontAwesome5
              name={rightIcon}
              size={16}
              color={components.input.icon}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {isError && (
        <Text style={[styles.errorText, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
    width: '100%',
  },
  label: {
    fontSize: fontSize.sm,
    color: components.input.label,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    backgroundColor: components.input.background,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  focusedInputContainer: {
    borderColor: components.input.focusedBorder,
  },
  errorInputContainer: {
    borderColor: components.input.errorBorder,
  },
  input: {
    flex: 1,
    fontSize: fontSize.md,
    color: components.input.text,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  errorInput: {
    color: components.input.errorText,
  },
  leftIcon: {
    padding: spacing.md,
  },
  rightIcon: {
    padding: spacing.md,
  },
  errorText: {
    color: components.input.errorText,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
});

export default TextInput; 