import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export type User = {
  id: string;
  name: string;
  email: string;
  profilePic?: string;
  emailVerified: boolean;
  walletAddress?: string;
};

type SignupData = {
  name: string;
  email: string;
  password: string;
};

type LoginData = {
  email: string;
  password: string;
};

type VerifyEmailData = {
  token: string;
};

let currentUser: User | null = null;

// Register a new user
export const signup = async (data: SignupData): Promise<{ user: User; token: string }> => {
  try {
    const response = await api.post('/auth/signup', data);
    const { token, user } = response.data;
    
    // Save token to AsyncStorage
    await AsyncStorage.setItem('authToken', token);
    
    currentUser = user;
    return { user, token };
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// Login with email and password
export const login = async (data: LoginData): Promise<{ user: User; token: string }> => {
  try {
    const response = await api.post('/auth/login', data);
    const { token, user } = response.data;
    
    // Save token to AsyncStorage
    await AsyncStorage.setItem('authToken', token);
    
    currentUser = user;
    return { user, token };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Verify email address
export const verifyEmail = async (data: VerifyEmailData): Promise<boolean> => {
  try {
    const response = await api.post('/auth/verify-email', data);
    
    if (currentUser) {
      currentUser.emailVerified = true;
    }
    
    return true;
  } catch (error) {
    console.error('Email verification error:', error);
    throw error;
  }
};

// Resend verification email
export const resendVerificationEmail = async (): Promise<boolean> => {
  try {
    await api.post('/auth/resend-verification');
    return true;
  } catch (error) {
    console.error('Resend verification error:', error);
    throw error;
  }
};

// Get the current logged-in user
export const getCurrentUser = async (): Promise<User | null> => {
  if (currentUser) {
    return currentUser;
  }
  
  const token = await AsyncStorage.getItem('authToken');
  if (!token) {
    return null;
  }
  
  try {
    const response = await api.get('/auth/me');
    currentUser = response.data;
    return currentUser;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
};

// Logout the current user
export const signOut = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('authToken');
    currentUser = null;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}; 