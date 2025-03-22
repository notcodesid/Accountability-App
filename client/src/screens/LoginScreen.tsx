import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigationTypes';
import { AuthContext } from '../context/AuthContext';
import { FontAwesome5 } from '@expo/vector-icons';
import Logo from '../components/Logo';
import GradientBackground from '../components/GradientBackground';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { colors, spacing, components } from '../config/theme';

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
  route: RouteProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  const validateInputs = () => {
    let isValid = true;
    
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    setTouched({
      email: true,
      password: true
    });
    
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      // Navigation will be handled by AppNavigator based on isLoggedIn state
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('Signup');
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.logoContainer}>
            <Logo size={100} color={colors.primary} />
            <Text style={styles.appName}>Accountability</Text>
            <Text style={styles.tagline}>Achieve more together</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your accountability journey</Text>

            <TextInput
              label="Email"
              value={email}
              placeholder='Email'
              onChangeText={(text) => {
                setEmail(text);
                if (touched.email) {
                  if (!text.trim()) {
                    setEmailError('Email is required');
                  } else if (!/\S+@\S+\.\S+/.test(text)) {
                    setEmailError('Please enter a valid email');
                  } else {
                    setEmailError('');
                  }
                }
              }}
              onBlur={() => setTouched({ ...touched, email: true })}
              error={emailError}
              touched={touched.email}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="envelope"
              containerStyle={styles.inputContainer}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (touched.password) {
                  if (!text.trim()) {
                    setPasswordError('Password is required');
                  } else if (text.length < 6) {
                    setPasswordError('Password must be at least 6 characters');
                  } else {
                    setPasswordError('');
                  }
                }
              }}
              onBlur={() => setTouched({ ...touched, password: true })}
              error={passwordError}
              touched={touched.password}
              leftIcon="lock"
              isPassword
              containerStyle={styles.inputContainer}
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button 
              title="Sign In"
              variant="gradient" 
              isLoading={isLoading}
              onPress={handleLogin}
              style={styles.loginButton}
              icon="sign-in-alt"
              iconRight
              fullWidth
              size="large"
            />

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <Button
              title="Create New Account"
              variant="secondary"
              onPress={handleSignUp}
              style={styles.signupButton}
              icon="user-plus"
              iconRight
              fullWidth
              size="large"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: spacing.sm,
  },
  tagline: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  formContainer: {
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
  },
  loginButton: {
    marginBottom: spacing.xl,
    height: 56,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    fontWeight: '600',
  },
  signupButton: {
    marginBottom: spacing.lg,
    height: 56,
  },
});

export default LoginScreen; 