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

export default function UsernameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const password = params.password as string;

  const { signup } = useAuth();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const isValidUsername = () => {
    return username.length >= 3 && username.length <= 15 && /^[a-zA-Z0-9]+$/.test(username);
  };

  const handleContinue = async () => {
    if (!isValidUsername()) {
      setError('Username must be 3-15 characters with no special characters');
      setShowError(true);
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await signup({
        email,
        password,
        username
      });
      
      if (success) {
        router.push('/(tabs)');
      } else {
        setError('Account creation failed. Please try again.');
        setShowError(true);
      }
    } catch (err) {
      setError('An error occurred during signup. Please try again.');
      setShowError(true);
    } finally {
      setLoading(false);
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
          <Text style={styles.title}>Create a username</Text>
          <Text style={styles.subtitle}>You can always change it later</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={OnboardingColors.textSecondary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoFocus
            />
          </View>
          
          <Text style={styles.usernameRequirement}>
            3-15 characters. Cannot include special characters
          </Text>
          
          <TouchableOpacity 
            style={[
              styles.continueButton, 
              !isValidUsername() || loading ? styles.disabledButton : null
            ]}
            onPress={handleContinue}
            disabled={!isValidUsername() || loading}
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
                <Text style={styles.continueButtonText}>Create Account</Text>
              )}
            </LinearGradient>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: OnboardingColors.textSecondary,
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 10,
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
  usernameRequirement: {
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
}); 