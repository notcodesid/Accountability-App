import React, { ReactNode } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ViewStyle,
  TouchableOpacity,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, shadows, components, gradients } from '../config/theme';

type CardVariant = 'default' | 'outlined' | 'elevated' | 'gradient';

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  style?: ViewStyle;
  onPress?: () => void;
  title?: string;
  titleStyle?: TextStyle;
  subtitle?: string;
  subtitleStyle?: TextStyle;
  footer?: ReactNode;
  footerStyle?: ViewStyle;
  disabled?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  style,
  onPress,
  title,
  titleStyle,
  subtitle,
  subtitleStyle,
  footer,
  footerStyle,
  disabled = false,
}) => {
  const getCardStyles = () => {
    const baseStyles = [styles.card];
    
    switch (variant) {
      case 'outlined':
        baseStyles.push(styles.outlinedCard);
        break;
      case 'elevated':
        baseStyles.push(styles.elevatedCard);
        break;
      case 'gradient':
        // Gradient styling handled separately
        break;
      default:
        baseStyles.push(styles.defaultCard);
        break;
    }
    
    if (disabled) {
      baseStyles.push(styles.disabledCard);
    }
    
    return [...baseStyles, style];
  };
  
  const cardContent = (
    <>
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
          {subtitle && <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>}
        </View>
      )}
      <View style={styles.content}>{children}</View>
      {footer && <View style={[styles.footer, footerStyle]}>{footer}</View>}
    </>
  );
  
  if (variant === 'gradient' && !disabled) {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        disabled={!onPress || disabled}
        onPress={onPress}
        style={[styles.cardWrapper, style]}
      >
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          {cardContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  
  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={disabled}
        onPress={onPress}
        style={getCardStyles()}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }
  
  return <View style={getCardStyles()}>{cardContent}</View>;
};

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  card: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  defaultCard: {
    backgroundColor: components.card.background,
  },
  outlinedCard: {
    backgroundColor: components.card.background,
    borderWidth: 1,
    borderColor: components.card.border,
  },
  elevatedCard: {
    backgroundColor: components.card.background,
    ...shadows.medium,
  },
  disabledCard: {
    opacity: 0.6,
  },
  header: {
    padding: spacing.md,
    paddingBottom: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: components.card.title,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: components.card.subtitle,
    marginBottom: spacing.xs,
  },
  content: {
    padding: spacing.md,
  },
  footer: {
    padding: spacing.md,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: components.card.divider,
  },
});

export default Card; 