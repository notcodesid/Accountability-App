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

export default function UsernameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const password = params.password as string;

  const [username, setUsername] = useState('');

  const isValidUsername = () => {
    return username.length >= 3 && username.length <= 15 && /^[a-zA-Z0-9]+$/.test(username);
  };

  const handleContinue = () => {
    if (!isValidUsername()) return;
    
    // In a real app, we would submit the registration information to an API
    // For this demo, we'll just navigate to the main app
    router.push('/(tabs)');
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
              !isValidUsername() ? styles.disabledButton : null
            ]}
            onPress={handleContinue}
            disabled={!isValidUsername()}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
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
  },
  usernameRequirement: {
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