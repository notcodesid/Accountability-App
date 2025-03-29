import { Platform } from 'react-native';
import { API_URL, logError } from '../constants/Environment';

// For iOS simulators, localhost might need to be 127.0.0.1
const getBaseUrl = () => {
  if (Platform.OS === 'ios') {
    return API_URL.replace('localhost', '127.0.0.1');
  }
  return API_URL;
};

// Generic get function with error handling
export async function fetchFromAPI<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${getBaseUrl()}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
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
}

export interface ChallengesResponse {
  success: boolean;
  count: number;
  data: APIChallenge[];
}

export const getChallenges = (): Promise<ChallengesResponse> => {
  return fetchFromAPI<ChallengesResponse>('/challenges');
};

// Add other API calls as needed 