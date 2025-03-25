/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

// Peloton-inspired colors for onboarding
export const OnboardingColors = {
  background: '#0d0d0c',        // Dark background color as specified
  cardBackground: '#151515',
  inputBackground: '#2C2C2E',
  accentColor: '#FF5757',       // Accent color from image (reddish)
  accentSecondary: '#FF7F50',   // Secondary accent for gradient effects
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  buttonText: '#FFFFFF',
  border: '#333333',
};

// Home screen specific colors
export const HomeColors = {
  header: '#3b3a23',            // Header background color
  background: '#010001',        // Main background color
  challengeCard: '#18181a',     // Challenge card background
  text: '#c4c2c9',              // Primary text color
  textSecondary: '#8a8891',     // Secondary text color
  button: '#252329',            // Button background color
  buttonText: '#ffffff',        // Button text color
  accent: '#FF5757',            // Accent color (using the same as onboarding for consistency)
};

// Tab navigation specific colors
export const TabColors = {
  tabBarBackground: '#2B2B2C',  // Dark gray for tab bar background
  tabIconActive: '#FEFEFE',     // Almost white for active tabs
  tabIconInactive: '#7E7E80',   // Gray for inactive tabs
  indicator: OnboardingColors.accentColor, // Using accent color for indicator
};

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: TabColors.tabIconInactive,
    tabIconSelected: TabColors.tabIconActive,
  },
};
