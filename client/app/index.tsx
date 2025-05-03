import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  ImageBackground,
  Animated,
} from 'react-native';
import { OnboardingColors } from '../constants/Colors';
import { useRouter } from 'expo-router';
import GoogleAuthButton from '../components/GoogleAuthButton';

export default function WelcomeScreen() {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(20);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {!imageError ? (
        <ImageBackground
          source={require('../assets/images/onboard.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
          onError={() => setImageError(true)}
        >
          <View style={styles.overlay}>{renderContent()}</View>
        </ImageBackground>
      ) : (
        <View style={[styles.overlay, { backgroundColor: OnboardingColors.background }]}>
          {renderContent()}
        </View>
      )}
    </View>
  );

  function renderContent() {
    return (
      <>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>LOCKIN</Text>
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Bet on yourself, Get Rewarded</Text>
            <Text style={styles.subtitle}>
              Put your goals to the test with real stakes. Join challenges, track your progress, and
              get rewarded for staying accountable. Compete with friends or the global community,
              and make success a habit.
            </Text>
          </View>
          {/* Google Auth Button */}
          <GoogleAuthButton />
        </Animated.View>

        <Animated.View style={[styles.termsContainer, { opacity: fadeAnim }]}>
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </Animated.View>
      </>
    );
  }
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: OnboardingColors.background,
  },
  backgroundImage: {
    flex: 1,
    width,
    height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 13, 12, 0.7)',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoText: {
    color: OnboardingColors.text,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  titleContainer: {
    marginBottom: 30,
  },
  title: {
    color: OnboardingColors.text,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subtitle: {
    color: OnboardingColors.text,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
  },
  termsContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  termsText: {
    color: OnboardingColors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  termsLink: {
    color: OnboardingColors.accentColor,
    textDecorationLine: 'underline',
  },
});