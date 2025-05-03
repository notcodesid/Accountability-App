import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import GoogleIcon from '../assets/customIocn';
import { OnboardingColors } from '../constants/Colors';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

interface GoogleAuthButtonProps {
  buttonStyle?: object;
  textStyle?: object;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ 
  buttonStyle, 
  textStyle 
}) => {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(false);

  // Get client IDs from environment variables
  const ios_client = Constants.expoConfig?.extra?.ios_client;
  const web_client = Constants.expoConfig?.extra?.web_client;
  const android_client = Constants.expoConfig?.extra?.android_client;

  // Set up Google auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: android_client,
    iosClientId: ios_client,
    webClientId: web_client,
    scopes: ['profile', 'email'],
  });

  // Handle Google auth response
  useEffect(() => {
    if (response?.type === 'success') {
      setAuthLoading(false);
      const { authentication } = response;
      console.log('Authentication successful!');
      console.log('Authentication object:', authentication);
      
      // Navigate to the tabs after successful authentication
      router.replace('/(tabs)');
    } 
    else if (response?.type === 'error') {
      setAuthLoading(false);
      console.error('Authentication failed:', response.error);
    }
  }, [response, router]);

  const handleGoogleAuth = async () => {
    try {
      setAuthLoading(true);
      console.log('Google auth initiated');
      await promptAsync();
    } catch (error) {
      setAuthLoading(false);
      console.error('Error initiating Google auth:', error);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.buttonPrimary, buttonStyle]} 
      onPress={handleGoogleAuth}
      disabled={authLoading}
    >
      <LinearGradient
        colors={[OnboardingColors.accentColor, OnboardingColors.accentSecondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientButton}
      >
        <View style={styles.googleButtonInner}>
          <GoogleIcon />
          <Text style={[styles.buttonPrimaryText, textStyle]}>
            {authLoading ? 'Loading...' : 'Continue with Google'}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonPrimary: {
    borderRadius: 30,
    height: 56,
    marginBottom: 15,
    overflow: 'hidden',
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buttonPrimaryText: {
    color: OnboardingColors.buttonText,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default GoogleAuthButton;
