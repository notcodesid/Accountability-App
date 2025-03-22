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
import { colors, spacing, components, fontSize } from '../config/theme';

type SignupScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Signup'>;
  route: RouteProp<RootStackParamList, 'Signup'>;
};

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    
    let isValid = true;
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    });
    
    return isValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await register(name, email, password);
      // After successful registration, navigate to the verification screen
      navigation.navigate('VerifyEmail', { email });
    } catch (error) {
      Alert.alert('Registration Failed', 'There was an error creating your account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    switch (field) {
      case 'name':
        setName(value);
        if (touched.name) {
          setErrors({
            ...errors,
            name: value.trim() ? '' : 'Name is required'
          });
        }
        break;
      case 'email':
        setEmail(value);
        if (touched.email) {
          let emailError = '';
          if (!value.trim()) {
            emailError = 'Email is required';
          } else if (!/\S+@\S+\.\S+/.test(value)) {
            emailError = 'Please enter a valid email';
          }
          setErrors({ ...errors, email: emailError });
        }
        break;
      case 'password':
        setPassword(value);
        if (touched.password) {
          let passwordError = '';
          if (!value.trim()) {
            passwordError = 'Password is required';
          } else if (value.length < 6) {
            passwordError = 'Password must be at least 6 characters';
          }
          setErrors({ ...errors, password: passwordError });
        }
        if (touched.confirmPassword && confirmPassword) {
          setErrors({
            ...errors,
            confirmPassword: value === confirmPassword ? '' : 'Passwords do not match'
          });
        }
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        if (touched.confirmPassword) {
          setErrors({
            ...errors,
            confirmPassword: value === password ? '' : 'Passwords do not match'
          });
        }
        break;
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    
    // Validate the field on blur
    switch (field) {
      case 'name':
        setErrors({
          ...errors,
          name: name.trim() ? '' : 'Name is required'
        });
        break;
      case 'email':
        let emailError = '';
        if (!email.trim()) {
          emailError = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
          emailError = 'Please enter a valid email';
        }
        setErrors({ ...errors, email: emailError });
        break;
      case 'password':
        let passwordError = '';
        if (!password.trim()) {
          passwordError = 'Password is required';
        } else if (password.length < 6) {
          passwordError = 'Password must be at least 6 characters';
        }
        setErrors({ ...errors, password: passwordError });
        break;
      case 'confirmPassword':
        setErrors({
          ...errors,
          confirmPassword: password === confirmPassword ? '' : 'Passwords do not match'
        });
        break;
    }
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.logoContainer}>
            <Logo size={80} color={colors.primary} />
            <Text style={styles.appName}>Accountability</Text>
            <Text style={styles.tagline}>Achieve more together</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join our community and start reaching your goals</Text>

            <TextInput
              label="Full Name"
              value={name}
              placeholder="Enter your full name"
              onChangeText={(text) => handleFieldChange('name', text)}
              onBlur={() => handleFieldBlur('name')}
              error={errors.name}
              touched={touched.name}
              leftIcon="user"
              containerStyle={styles.inputContainer}
            />

            <TextInput
              label="Email Address"
              value={email}
              placeholder="Enter your email"
              onChangeText={(text) => handleFieldChange('email', text)}
              onBlur={() => handleFieldBlur('email')}
              error={errors.email}
              touched={touched.email}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="envelope"
              containerStyle={styles.inputContainer}
            />

            <TextInput
              label="Password"
              value={password}
              placeholder="Create a password"
              onChangeText={(text) => handleFieldChange('password', text)}
              onBlur={() => handleFieldBlur('password')}
              error={errors.password}
              touched={touched.password}
              leftIcon="lock"
              isPassword
              containerStyle={styles.inputContainer}
            />

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              placeholder="Confirm your password"
              onChangeText={(text) => handleFieldChange('confirmPassword', text)}
              onBlur={() => handleFieldBlur('confirmPassword')}
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
              leftIcon="lock"
              isPassword
              containerStyle={styles.inputContainer}
            />

            <Button 
              title="Create Account"
              variant="gradient" 
              isLoading={isLoading}
              onPress={handleSignup}
              style={styles.signupButton}
              icon="user-plus"
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
              title="Sign In Instead"
              variant="secondary"
              onPress={() => navigation.navigate('Login')}
              style={styles.loginButton}
              icon="sign-in-alt"
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
    marginTop: 60,
    marginBottom: 30,
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
  signupButton: {
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
  loginButton: {
    marginBottom: spacing.lg,
    height: 56,
  },
});

export default SignupScreen; 