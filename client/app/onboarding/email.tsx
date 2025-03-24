import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  StatusBar, 
  Keyboard, 
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Animated
} from 'react-native';
import { OnboardingColors } from '../../constants/Colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export default function EmailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isSignIn = params.signin === 'true';

  const [email, setEmail] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(20);

  useEffect(() => {
    // Start the animation when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    if (email.trim() === '') return;
    
    router.push({
      pathname: '/onboarding/password',
      params: { email: email, isSignIn: isSignIn ? 'true' : 'false' }
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <StatusBar barStyle="light-content" />
        
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <Animated.View 
          style={[
            styles.content,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.title}>What's your email?</Text>
          <Text style={styles.subtitle}>To start, create a new Accountability account.</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={OnboardingColors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoFocus
            />
          </View>
          
          {!isSignIn && (
            <View style={styles.checkboxContainer}>
              <TouchableOpacity 
                style={styles.checkbox}
                onPress={() => setIsChecked(!isChecked)}
              >
                {isChecked ? (
                  <Ionicons name="checkbox" size={24} color={OnboardingColors.accentColor} />
                ) : (
                  <Ionicons name="square-outline" size={24} color="white" />
                )}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>
                Sign up to hear about your fitness progress, milestone celebrations, new features, products and more!
              </Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={[styles.continueButton, email.trim() === '' ? styles.disabledButton : null]}
            onPress={handleContinue}
            disabled={email.trim() === ''}
          >
            <LinearGradient
              colors={[OnboardingColors.accentColor, OnboardingColors.accentSecondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
        
        <View style={styles.footer}>
          {isSignIn ? (
            <View style={styles.signUpContainer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => router.push({
                  pathname: '/onboarding/email',
                  params: { signin: 'false' }
                })}
              >
                <Text style={styles.signUpText}>Sign up</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.termsContainer}>
              <Text style={styles.footerText}>By signing up, you agree to our </Text>
              <TouchableOpacity>
                <Text style={styles.linkText}>Terms of Service</Text>
              </TouchableOpacity>
              <Text style={styles.footerText}>, </Text>
              <TouchableOpacity>
                <Text style={styles.linkText}>Membership Terms</Text>
              </TouchableOpacity>
              <Text style={styles.footerText}> and </Text>
              <TouchableOpacity>
                <Text style={styles.linkText}>Privacy Policy</Text>
              </TouchableOpacity>
              <Text style={styles.footerText}>.</Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: OnboardingColors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: OnboardingColors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: OnboardingColors.textSecondary,
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: OnboardingColors.inputBackground,
    borderRadius: 10,
    color: OnboardingColors.text,
    fontSize: 16,
    padding: 15,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    flex: 1,
    color: OnboardingColors.text,
    fontSize: 14,
    lineHeight: 22,
  },
  continueButton: {
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
  disabledButton: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: OnboardingColors.buttonText,
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: OnboardingColors.textSecondary,
    fontSize: 12,
  },
  linkText: {
    color: OnboardingColors.accentColor,
    fontSize: 12,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  signUpText: {
    color: OnboardingColors.accentColor,
    fontSize: 12,
    fontWeight: '500',
  },
}); 