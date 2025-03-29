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
  ActivityIndicator
} from 'react-native';
import { OnboardingColors } from '../../constants/Colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import ErrorAlert from '../../components/ErrorAlert';
import { useAuth } from '../../context/AuthContext';

export default function PasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const isSignIn = params.isSignIn === 'true';

  const { signin } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const handleCreateAccount = async () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setShowError(true);
      return;
    }
    
    if (isSignIn) {
      // Handle sign in
      setLoading(true);
      try {
        const success = await signin({
          emailOrUsername: email,
          password: password
        });
        
        if (success) {
          router.push('/(tabs)');
        } else {
          setError('Invalid email or password');
          setShowError(true);
        }
      } catch (err) {
        setError('An error occurred during sign in');
        setShowError(true);
      } finally {
        setLoading(false);
      }
    } else {
      // For sign up flow, just continue to username screen
      router.push({
        pathname: '/onboarding/username',
        params: { email, password },
      });
    }
  };

  const handleErrorClose = () => {
    setShowError(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <StatusBar barStyle="light-content" />
        
        <ErrorAlert 
          message={error || ''} 
          visible={showError} 
          onClose={handleErrorClose} 
        />
        
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title}>
            {isSignIn ? 'Enter your password' : 'Set a password'}
          </Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={OnboardingColors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoFocus
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? "eye" : "eye-off"} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.passwordRequirement}>
            Must be at least 8 characters
          </Text>
          
          <TouchableOpacity 
            style={[
              styles.continueButton, 
              password.length < 8 || loading ? styles.disabledButton : null
            ]}
            onPress={handleCreateAccount}
            disabled={password.length < 8 || loading}
          >
            <LinearGradient
              colors={[OnboardingColors.accentColor, OnboardingColors.accentSecondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.continueButtonText}>
                  {isSignIn ? 'Sign in' : 'Continue'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
          
          {isSignIn && (
            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
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
    marginBottom: 30,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  input: {
    backgroundColor: OnboardingColors.inputBackground,
    borderRadius: 10,
    color: OnboardingColors.text,
    fontSize: 16,
    padding: 15,
    height: 56,
    paddingRight: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 16,
  },
  passwordRequirement: {
    color: OnboardingColors.textSecondary,
    fontSize: 14,
    marginBottom: 30,
  },
  continueButton: {
    borderRadius: 30,
    height: 56,
    overflow: 'hidden',
    shadowColor: OnboardingColors.accentColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordButton: {
    alignSelf: 'center',
    marginTop: 20,
    padding: 10,
  },
  forgotPasswordText: {
    color: OnboardingColors.accentColor,
    fontSize: 14,
  },
}); 