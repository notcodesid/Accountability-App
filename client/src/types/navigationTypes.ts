import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Challenge, ChallengeParticipant } from '../services/dummyData';

export type RootStackParamList = {
  // Auth stack screens
  Login: undefined;
  Signup: undefined;
  VerifyEmail: { email?: string };
  
  // Main stack screens
  Home: undefined;
  ChallengeDetails: { challengeId: string };
  Leaderboard: { challengeId: string };
  ProgressTracking: { challengeId: string };
  RecordProgress: { challengeId: string };
  
  // Tab navigator screens
  HomeStack: undefined;
  Discover: undefined;
  CreateStack: undefined;
  CreateChallenge: undefined;
  Wallet: undefined;
  Profile: undefined;
};

export type NavigationProps<T extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
}; 