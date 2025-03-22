/**
 * Navigation type definitions to be used across the app
 */

// Define the parameter types for navigation routes
export type RootStackParamList = {
  // Authentication screens
  Login: undefined;
  VerifyEmail: { email: string };
  
  // Main app screens
  Home: undefined;
  ChallengeDetails: { challengeId: string };
  CreateChallenge: undefined;
  JoinChallenge: undefined;
  Profile: undefined;
  ProgressTracking: { challengeId: string };
  RecordProgress: { challengeId: string; date?: string };
  Leaderboard: { challengeId: string };
  Wallet: undefined;
}; 