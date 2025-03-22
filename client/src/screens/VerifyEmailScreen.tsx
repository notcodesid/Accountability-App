import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigationTypes';
import { AuthContext } from '../context/AuthContext';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { colors, spacing, components, fontSize, borderRadius } from '../config/theme';
import { verifyEmail } from '../services/auth';

type VerifyEmailScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'VerifyEmail'>;
  route: RouteProp<RootStackParamList, 'VerifyEmail'>;
};

const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({ route, navigation }) => {
  const { login } = useContext(AuthContext);
  const { email = '' } = route.params || {};
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const handleVerifyEmail = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }
    
    setIsLoading(true);
    try {
      // In a real app, this would call an API to verify the code
      const verified = await verifyEmail(email, verificationCode);
      
      if (verified) {
        // Log the user in
        await login(email, 'password'); // In a real app, you'd use their real password
        // Navigation handled by AuthContext
      } else {
        setError('Invalid verification code, please try again');
      }
    } catch (error) {
      Alert.alert('Verification Failed', 'There was an error verifying your email');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendCode = () => {
    Alert.alert('Code Resent', 'A new verification code has been sent to your email');
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Verify Your Email</Text>
            <View style={{width: 40}} /> {/* Placeholder for balance */}
          </View>
          
          <View style={styles.content}>
            <View style={styles.emailContainer}>
              <FontAwesome5 name="envelope-open-text" size={50} color={colors.primary} style={styles.emailIcon} />
              <Text style={styles.title}>Check Your Email</Text>
              <Text style={styles.subtitle}>
                We've sent a verification code to{'\n'}
                <Text style={styles.emailText}>{email}</Text>
              </Text>
            </View>
            
            <View style={styles.formContainer}>
              <TextInput
                label="Verification Code"
                placeholder="Enter the 6-digit code"
                value={verificationCode}
                onChangeText={(text) => {
                  setVerificationCode(text);
                  if (touched && !text.trim()) {
                    setError('Verification code is required');
                  } else {
                    setError('');
                  }
                }}
                onBlur={() => {
                  setTouched(true);
                  if (!verificationCode.trim()) {
                    setError('Verification code is required');
                  }
                }}
                error={error}
                touched={touched}
                keyboardType="number-pad"
                maxLength={6}
                leftIcon="key"
                containerStyle={styles.inputContainer}
              />
              
              <Button 
                title="Verify Email"
                variant="gradient" 
                isLoading={isLoading}
                onPress={handleVerifyEmail}
                style={styles.verifyButton}
                icon="check-circle"
                iconRight
                fullWidth
                size="large"
              />
              
              <View style={styles.helpContainer}>
                <Text style={styles.helpText}>Didn't receive the code?</Text>
                <TouchableOpacity onPress={handleResendCode}>
                  <Text style={styles.resendLink}>Resend Code</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.changeEmailButton}
                onPress={() => navigation.navigate('Signup')} 
              >
                <FontAwesome5 name="envelope" size={16} color={colors.primary} style={{marginRight: spacing.sm}} />
                <Text style={styles.changeEmailText}>Change Email Address</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.round,
    backgroundColor: colors.cardDark,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  emailContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  emailIcon: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  emailText: {
    color: colors.primary,
    fontWeight: '600',
  },
  formContainer: {
    marginTop: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  verifyButton: {
    marginBottom: spacing.lg,
    height: 56,
  },
  helpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  helpText: {
    color: colors.textSecondary,
  },
  resendLink: {
    color: colors.primary,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  changeEmailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  changeEmailText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VerifyEmailScreen; 