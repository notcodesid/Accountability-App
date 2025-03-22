// Theme configuration for the Accountability App
// Based on dark purple/blue colors

export const colors = {
  // Primary colors
  background: '#140c1c',
  backgroundDarker: '#040404',
  backgroundLighter: '#1c0d1c',
  
  // Secondary colors 
  secondary: '#14141c',
  secondaryAlt: '#18081c',
  
  // UI colors
  primary: '#8c7ae6', // Bright purple for primary actions
  success: '#4CAF50',
  warning: '#FFC107',
  danger: '#F44336',
  info: '#2196F3',
  
  // Text colors
  textPrimary: '#ffffff',
  textSecondary: '#b0b0cc',
  textMuted: '#767696',
  
  // Border colors
  border: '#2d1e36',
  borderLight: '#3a2a45',
  
  // Card and component colors
  card: '#1c1029',
  cardAlt: '#241435',
  cardDark: '#0c0812',
  
  // Input and form colors
  input: '#241435',
  inputBorder: '#3a2a45',
  inputFocus: '#4a3055',
  
  // Button variants
  buttonPrimary: '#8c7ae6',
  buttonSecondary: '#241435',
  buttonDanger: '#F44336',
  buttonDisabled: '#3a2a45',
  
  // Gradient colors
  gradientStart: '#8c7ae6',
  gradientEnd: '#6c5ce7',
};

export const gradients = {
  background: ['#140c1c', '#040404'],
  card: ['#1c1029', '#12081a'],
  primary: ['#8c7ae6', '#6c5ce7'],
  success: ['#4CAF50', '#388E3C'],
  warning: ['#FFC107', '#FFA000'],
  danger: ['#F44336', '#D32F2F'],
};

export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
};

export const spacing = {
  xs: 4,
  sm: 8, 
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Component-specific theming
export const components = {
  header: {
    background: colors.background,
    border: colors.border,
    title: colors.textPrimary,
    icon: colors.textSecondary,
  },
  
  card: {
    background: colors.card,
    border: colors.border,
    title: colors.textPrimary,
    subtitle: colors.textSecondary,
    text: colors.textSecondary,
    divider: colors.border,
  },
  
  button: {
    primaryBackground: colors.buttonPrimary,
    secondaryBackground: colors.buttonSecondary,
    primaryText: colors.textPrimary,
    secondaryText: colors.primary,
    disabledBackground: colors.buttonDisabled,
    disabledText: colors.textMuted,
  },
  
  input: {
    background: colors.input,
    border: colors.inputBorder,
    focusedBorder: colors.primary,
    errorBorder: colors.danger,
    text: colors.textPrimary,
    label: colors.textSecondary,
    icon: colors.textSecondary,
    placeholder: colors.textMuted,
    errorText: colors.danger,
  },
  
  tabBar: {
    background: colors.cardDark,
    active: colors.primary,
    inactive: colors.textMuted,
    border: colors.border,
  },
  
  progressBar: {
    background: colors.backgroundLighter,
    primary: colors.primary,
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
  },
  
  modal: {
    background: colors.card,
    border: colors.border,
    title: colors.textPrimary,
    backdrop: 'rgba(0, 0, 0, 0.7)',
  },
  
  avatar: {
    background: colors.secondary,
    text: colors.textPrimary,
    border: colors.borderLight,
  },
  
  toggle: {
    activeBackground: colors.primary,
    inactiveBackground: colors.buttonDisabled,
    thumbActive: colors.textPrimary,
    thumbInactive: colors.textSecondary,
  },
  
  toast: {
    background: colors.cardDark,
    success: colors.success,
    error: colors.danger,
    warning: colors.warning,
    info: colors.info,
    text: colors.textPrimary,
  },
};

export default {
  colors,
  gradients,
  fontFamily,
  fontSize,
  spacing,
  borderRadius,
  shadows,
  components,
}; 