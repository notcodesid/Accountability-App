import { Platform } from 'react-native';
import { API_URL, logError } from '../constants/Environment';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For iOS simulators, localhost might need to be 127.0.0.1
const getBaseUrl = () => {
  if (Platform.OS === 'ios') {
    return API_URL.replace('localhost', '127.0.0.1');
  }
  return API_URL;
};

// Get auth token from storage
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('auth_token');
  } catch (error) {
    logError('Error retrieving auth token:', error);
    return null;
  }
};

// Set auth token in storage
export const setAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('auth_token', token);
  } catch (error) {
    logError('Error saving auth token:', error);
  }
};

// Remove auth token from storage (logout)
export const removeAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('auth_token');
  } catch (error) {
    logError('Error removing auth token:', error);
  }
};

// Generic get function with error handling
export async function fetchFromAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const token = await getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${getBaseUrl()}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...(options?.headers || {}),
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `API request failed with status ${response.status}`
      );
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    logError('API fetch error:', error);
    throw error;
  }
}

// Challenge-specific functions
export interface APIChallenge {
  id: number;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  image: string;
  startDate: string;
  endDate: string;
  duration: string;
  userStake: number;
  totalPrizePool: number;
  participantCount: number;
  rules: string[];
  metrics: string;
  trackingMetrics: string[];
  createdAt: string;
  updatedAt: string;
  progress?: number; // User's progress in the challenge (0.0 to 1.0)
  status?: 'active' | 'completed';
}

export interface ChallengesResponse {
  success: boolean;
  count: number;
  data: APIChallenge[];
}

export const getChallenges = (): Promise<ChallengesResponse> => {
  return fetchFromAPI<ChallengesResponse>('/challenges');
};

export interface ChallengeResponse {
  success: boolean;
  data: APIChallenge;
}

export const getChallengeById = (id: string): Promise<ChallengeResponse> => {
  return fetchFromAPI<ChallengeResponse>(`/challenges/${id}`);
};

// Authentication interfaces
export interface SignupRequest {
  email: string;
  password: string;
  username: string;
}

export interface SigninRequest {
  emailOrUsername: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    email: string;
    username: string;
    wallet?: {
      id: number;
      balance: number;
      currency: string;
    };
  };
}

// Signup function
export const signup = async (userData: SignupRequest): Promise<AuthResponse> => {
  try {
    const response = await fetchFromAPI<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.token) {
      await setAuthToken(response.token);
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

// Signin function
export const signin = async (credentials: SigninRequest): Promise<AuthResponse> => {
  try {
    const response = await fetchFromAPI<AuthResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.token) {
      await setAuthToken(response.token);
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

// Get current user data
export const getCurrentUser = (): Promise<AuthResponse> => {
  return fetchFromAPI<AuthResponse>('/auth/me');
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getAuthToken();
  return !!token;
};

// Logout function
export const logout = async (): Promise<void> => {
  await removeAuthToken();
};

// Wallet interfaces
export interface WalletData {
  balance: number;
}

export interface WalletResponse {
  success: boolean;
  data: WalletData;
}

// Fetch wallet information
export const getWalletBalance = (): Promise<WalletResponse> => {
  return fetchFromAPI<WalletResponse>('/wallet');
};

// Transaction interfaces
export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'CHALLENGE_JOIN' | 'CHALLENGE_REWARD' | 'SYSTEM_BONUS' | 'REFERRAL_BONUS';
  description: string;
  relatedChallengeId?: number;
  createdAt: string;
}

export interface TransactionResponse {
  success: boolean;
  data: Transaction[];
}

export const getTransactionHistory = (): Promise<TransactionResponse> => {
  return fetchFromAPI<TransactionResponse>('/wallet/transactions');
};

// User Challenge interfaces
export interface UserChallenge {
  id: string;
  userId: string;
  challengeId: number;
  status: 'ACTIVE' | 'COMPLETED' | 'FAILED';
  progress: number;
  stakeAmount: number;
  joinedAt: string;
  completedAt?: string;
  challenge: APIChallenge;
}

export interface UserChallengesResponse {
  success: boolean;
  count: number;
  data: UserChallenge[];
}

export const getUserActiveChallenges = (): Promise<UserChallengesResponse> => {
  return fetchFromAPI<UserChallengesResponse>('/challenges/user/active');
};

// Join challenge interface
export interface JoinChallengeResponse {
  success: boolean;
  message: string;
  data?: {
    userChallenge: UserChallenge;
    newWalletBalance: number;
  };
}

export const joinChallenge = (challengeId: number): Promise<JoinChallengeResponse> => {
  return fetchFromAPI<JoinChallengeResponse>(`/challenges/${challengeId}/join`, {
    method: 'POST',
  });
};

// Leaderboard interfaces
export interface LeaderboardUser {
  id: number;
  userId: string;
  name: string;
  points: number;
  avatar: string;
  rank: number;
  updatedAt: string;
}

export interface LeaderboardResponse {
  success: boolean;
  count: number;
  data: LeaderboardUser[];
}

export const getLeaderboard = (): Promise<LeaderboardResponse> => {
  return fetchFromAPI<LeaderboardResponse>('/leaderboard');
};

export interface UserRankResponse {
  success: boolean;
  data: LeaderboardUser & { actualRank: number };
}

export const getUserRank = (userId: string): Promise<UserRankResponse> => {
  return fetchFromAPI<UserRankResponse>(`/leaderboard/user/${userId}`);
};

// Add other API calls as needed 