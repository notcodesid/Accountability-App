import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  StatusBar,
  Dimensions,
  ImageBackground,
  Animated
} from 'react-native';
import { OnboardingColors } from '../constants/Colors';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function WelcomeScreen() {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const { isLoading, isLoggedIn } = useAuth();
  
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(20);

  useEffect(() => {
    // Skip loading if we're already on the right screen
    if (isLoading) return;

    // Redirect based on auth status
    if (isLoggedIn) {
      router.replace('/(tabs)');
    } else {
      router.replace({
        pathname: '/onboarding/email',
        params: { signin: 'false' } // Default to signup
      });
    }
  }, [isLoading, isLoggedIn]);

  useEffect(() => {
    // Start the animation when component mounts
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
          <View style={styles.overlay}>
            {renderContent()}
          </View>
        </ImageBackground>
      ) : (
        // Fallback if image is not available
        <View style={[styles.overlay, { backgroundColor: OnboardingColors.background }]}>
          {renderContent()}
        </View>
      )}
    </View>
  );

  // Extracted content rendering to avoid duplication
  function renderContent() {
    return (
      <>
        <Animated.View 
          style={[
            styles.content,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>ACCOUNTABILITY</Text>
          </View>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Bet on yourself, Get Rewarded</Text>
            <Text style={styles.subtitle}>
              Put your goals to the test with real stakes. Join challenges, track your progress, and get rewarded for staying accountable. Compete with friends or the global community, and make success a habit.
            </Text>
          </View>
          
          <View style={styles.infoText}>
            <Text style={styles.infoTextContent}>
              Already have an account? Sign in to continue your journey. Your progress, settings, and rewards stay in sync across all devices.
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.buttonPrimary}
            onPress={() => router.push("/onboarding/email")}
          >
            <LinearGradient
              colors={[OnboardingColors.accentColor, OnboardingColors.accentSecondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonPrimaryText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.buttonSecondary}
            onPress={() => router.push({
              pathname: "/onboarding/signin"
            })}
          >
            <Text style={styles.buttonSecondaryText}>Sign In</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View style={[styles.progressDots, { opacity: fadeAnim }]}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
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
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 13, 12, 0.7)', // Semi-transparent overlay matching the background color
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
  },
  infoText: {
    marginBottom: 30,
  },
  infoTextContent: {
    color: OnboardingColors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  buttonPrimary: {
    borderRadius: 30,
    height: 56,
    marginBottom: 15,
    shadowColor: OnboardingColors.accentColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPrimaryText: {
    color: OnboardingColors.buttonText,
    fontSize: 18,
    fontWeight: '600',
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 30,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',  // Slight transparency
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonSecondaryText: {
    color: OnboardingColors.buttonText,
    fontSize: 18,
    fontWeight: '500',
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: OnboardingColors.accentColor,
  },
}); 