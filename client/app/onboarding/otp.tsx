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
import React, { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export default function OTPScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const isSignIn = params.isSignIn === 'true';

  // Create state for 6 digits
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeInput, setActiveInput] = useState(0);
  const [isValid, setIsValid] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);

  // Create refs for input fields
  const inputRefs = useRef<Array<TextInput | null>>([]);

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

    // Start the countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check if OTP is valid
  useEffect(() => {
    setIsValid(otp.every(digit => digit !== ''));
  }, [otp]);

  const handleOtpChange = (text: string, index: number) => {
    // Only accept digits
    if (!/^\d*$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text.slice(0, 1); // Only take the first character

    setOtp(newOtp);

    // If input is filled and not the last one, move to next
    if (text !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setActiveInput(index + 1);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1]?.focus();
      setActiveInput(index - 1);
    }
  };

  const handleResendCode = () => {
    // Reset OTP fields
    setOtp(['', '', '', '', '', '']);
    setActiveInput(0);
    inputRefs.current[0]?.focus();
    
    // Reset countdown
    setCountdown(60);
    setResendDisabled(true);
    
    // Here you would call the API to resend the code
    // For now, this is just UI functionality
  };

  const handleVerify = () => {
    if (!isValid) return;
    
    // Navigate to password screen
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
          <Text style={styles.title}>Verify your email</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit verification code to{' '}
            <Text style={styles.emailText}>{email}</Text>
          </Text>
          
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={el => inputRefs.current[index] = el}
                style={[
                  styles.otpInput,
                  activeInput === index && styles.otpInputActive,
                  digit !== '' && styles.otpInputFilled
                ]}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                onFocus={() => setActiveInput(index)}
                caretHidden={true}
              />
            ))}
          </View>
          
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Didn't receive the code?{' '}
              {resendDisabled ? (
                <Text style={styles.countdownText}>Resend in {countdown}s</Text>
              ) : (
                <TouchableOpacity onPress={handleResendCode}>
                  <Text style={styles.resendLink}>Resend Code</Text>
                </TouchableOpacity>
              )}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.verifyButton, !isValid && styles.disabledButton]}
            onPress={handleVerify}
            disabled={!isValid}
          >
            <LinearGradient
              colors={[OnboardingColors.accentColor, OnboardingColors.accentSecondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.verifyButtonText}>Verify</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
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
    lineHeight: 24,
  },
  emailText: {
    color: OnboardingColors.text,
    fontWeight: '500',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInput: {
    width: 45,
    height: 56,
    borderRadius: 10,
    backgroundColor: OnboardingColors.inputBackground,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: OnboardingColors.text,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  otpInputActive: {
    borderColor: OnboardingColors.accentColor,
  },
  otpInputFilled: {
    backgroundColor: 'rgba(255, 87, 87, 0.1)',
    borderColor: OnboardingColors.accentColor,
  },
  resendContainer: {
    marginBottom: 30,
  },
  resendText: {
    color: OnboardingColors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  countdownText: {
    color: OnboardingColors.textSecondary,
  },
  resendLink: {
    color: OnboardingColors.accentColor,
    fontWeight: '600',
  },
  verifyButton: {
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
  verifyButtonText: {
    color: OnboardingColors.buttonText,
    fontSize: 18,
    fontWeight: '600',
  },
}); 