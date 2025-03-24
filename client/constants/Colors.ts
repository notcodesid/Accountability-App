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
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
