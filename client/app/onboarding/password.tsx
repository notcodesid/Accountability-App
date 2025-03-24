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
  Platform
} from 'react-native';
import { OnboardingColors } from '../../constants/Colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function PasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const isSignIn = params.isSignIn === 'true';

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleCreateAccount = () => {
    if (password.length < 8) return;
    
    router.push({
      pathname: isSignIn ? '/(tabs)' : '/onboarding/username',
      params: { email, password },
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
        
        <View style={styles.content}>
          <Text style={styles.title}>Set a password</Text>
          
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
              password.length < 8 ? styles.disabledButton : null
            ]}
            onPress={handleCreateAccount}
            disabled={password.length < 8}
          >
            <Text style={styles.continueButtonText}>
              {isSignIn ? 'Sign in' : 'Create account'}
            </Text>
          </TouchableOpacity>
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
    backgroundColor: OnboardingColors.accentColor,
    borderRadius: 30,
    height: 56,
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
}); 