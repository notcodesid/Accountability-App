import { User } from './auth';

export type Challenge = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  goalType: 'STEPS' | 'WORKOUTS' | 'MEDITATION' | 'CUSTOM';
  goalTarget: number;
  entryFee: number;
  creatorId: string;
  creator: User;
  isPublic: boolean;
  participants: Participant[];
  createdAt: string;
};

export type Participant = {
  id: string;
  userId: string;
  user: User;
  challengeId: string;
  hasPaid: boolean;
  hasCompleted: boolean | null;
  progress: ProgressRecord[];
  createdAt: string;
};

export type ProgressRecord = {
  id: string;
  participationId: string;
  date: string;
  value: number;
  source: 'GOOGLE_FIT' | 'APPLE_HEALTH' | 'FITBIT' | 'MANUAL';
  createdAt: string;
};

// Dummy users
export const dummyUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
    emailVerified: true,
    walletAddress: '0x1234567890abcdef'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    profilePic: 'https://randomuser.me/api/portraits/women/1.jpg',
    emailVerified: true,
    walletAddress: '0x2345678901bcdef'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    profilePic: 'https://randomuser.me/api/portraits/men/2.jpg',
    emailVerified: true,
    walletAddress: '0x3456789012cdef'
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice@example.com',
    profilePic: 'https://randomuser.me/api/portraits/women/2.jpg',
    emailVerified: true,
    walletAddress: '0x4567890123def'
  }
];

// Generate progress records for a participation
const generateProgressRecords = (participationId: string, startDate: Date, endDate: Date, goalType: Challenge['goalType']): ProgressRecord[] => {
  const records: ProgressRecord[] = [];
  const currentDate = new Date(startDate);
  const dayDiff = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  for (let i = 0; i < dayDiff; i++) {
    if (currentDate <= new Date()) {
      let value = 0;
      
      switch (goalType) {
        case 'STEPS':
          value = Math.floor(Math.random() * 5000) + 5000; // 5000-10000 steps
          break;
        case 'WORKOUTS':
          value = Math.random() > 0.3 ? 1 : 0; // 70% chance of working out
          break;
        case 'MEDITATION':
          value = Math.floor(Math.random() * 20) + 10; // 10-30 minutes
          break;
        case 'CUSTOM':
          value = Math.floor(Math.random() * 10) + 1; // 1-10 units
          break;
      }
      
      records.push({
        id: `progress-${participationId}-${i}`,
        participationId,
        date: new Date(currentDate).toISOString(),
        value,
        source: Math.random() > 0.3 ? 'MANUAL' : 'APPLE_HEALTH',
        createdAt: new Date(currentDate).toISOString()
      });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return records;
};

// Generate participants for a challenge
const generateParticipants = (challenge: Omit<Challenge, 'participants'>, userIds: string[]): Participant[] => {
  return userIds.map((userId, index) => {
    const user = dummyUsers.find(u => u.id === userId)!;
    const participationId = `participation-${challenge.id}-${userId}`;
    
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);
    
    const progressRecords = generateProgressRecords(participationId, startDate, endDate, challenge.goalType);
    
    return {
      id: participationId,
      userId,
      user,
      challengeId: challenge.id,
      hasPaid: true,
      hasCompleted: null, // Will be determined at the end of the challenge
      progress: progressRecords,
      createdAt: new Date(startDate.getTime() - (24 * 60 * 60 * 1000 * (index + 1))).toISOString()
    };
  });
};

// Dummy challenges
export const dummyChallenges: Challenge[] = [
  {
    id: 'challenge-1',
    title: '10K Steps Daily',
    description: 'Walk at least 10,000 steps every day for a month. Stay active and healthy!',
    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // Started 15 days ago
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // Ends in 15 days
    goalType: 'STEPS',
    goalTarget: 10000,
    entryFee: 25,
    creatorId: '1',
    creator: dummyUsers[0],
    isPublic: true,
    participants: [],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'challenge-2',
    title: 'Daily Meditation',
    description: 'Meditate for at least 15 minutes every day for two weeks. Find inner peace!',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Started 7 days ago
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Ends in 7 days
    goalType: 'MEDITATION',
    goalTarget: 15,
    entryFee: 15,
    creatorId: '2',
    creator: dummyUsers[1],
    isPublic: true,
    participants: [],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'challenge-3',
    title: 'Workout Streak',
    description: 'Exercise at least 4 times a week for a month. Get fit and stay motivated!',
    startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // Started 20 days ago
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // Ends in 10 days
    goalType: 'WORKOUTS',
    goalTarget: 4,
    entryFee: 30,
    creatorId: '3',
    creator: dummyUsers[2],
    isPublic: true,
    participants: [],
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'challenge-4',
    title: 'Reading Challenge',
    description: 'Read at least 20 pages every day for two weeks. Expand your knowledge!',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Starts in 7 days
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // Ends in 21 days
    goalType: 'CUSTOM',
    goalTarget: 20,
    entryFee: 10,
    creatorId: '4',
    creator: dummyUsers[3],
    isPublic: true,
    participants: [],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

// Add participants to challenges
dummyChallenges[0].participants = generateParticipants(dummyChallenges[0], ['1', '2', '3']);
dummyChallenges[1].participants = generateParticipants(dummyChallenges[1], ['2', '3', '4']);
dummyChallenges[2].participants = generateParticipants(dummyChallenges[2], ['1', '3', '4']);
dummyChallenges[3].participants = generateParticipants(dummyChallenges[3], ['1', '2', '4']);

// Get challenges for a specific user
export const getUserChallenges = (userId: string): Challenge[] => {
  return dummyChallenges.filter(challenge => 
    challenge.creatorId === userId || 
    challenge.participants.some(p => p.userId === userId)
  );
};

// Get active challenges for a specific user
export const getActiveUserChallenges = (userId: string): Challenge[] => {
  const now = new Date();
  return getUserChallenges(userId).filter(challenge => 
    new Date(challenge.startDate) <= now && new Date(challenge.endDate) >= now
  );
};

// Get upcoming challenges for a specific user
export const getUpcomingUserChallenges = (userId: string): Challenge[] => {
  const now = new Date();
  return getUserChallenges(userId).filter(challenge => 
    new Date(challenge.startDate) > now
  );
};

// Get completed challenges for a specific user
export const getCompletedUserChallenges = (userId: string): Challenge[] => {
  const now = new Date();
  return getUserChallenges(userId).filter(challenge => 
    new Date(challenge.endDate) < now
  );
};

// Get public challenges that the user hasn't joined
export const getAvailableChallenges = (userId: string): Challenge[] => {
  const now = new Date();
  return dummyChallenges.filter(challenge => 
    challenge.isPublic && 
    new Date(challenge.endDate) >= now &&
    !challenge.participants.some(p => p.userId === userId) &&
    challenge.creatorId !== userId
  );
};

// Get progress for a specific user and challenge
export const getUserChallengeProgress = (userId: string, challengeId: string): ProgressRecord[] | null => {
  const challenge = dummyChallenges.find(c => c.id === challengeId);
  if (!challenge) return null;
  
  const participation = challenge.participants.find(p => p.userId === userId);
  if (!participation) return null;
  
  return participation.progress;
};

// Calculate user completion percentage for a challenge
export const calculateChallengeCompletion = (userId: string, challengeId: string): number => {
  const progress = getUserChallengeProgress(userId, challengeId);
  if (!progress) return 0;
  
  const challenge = dummyChallenges.find(c => c.id === challengeId);
  if (!challenge) return 0;
  
  const totalDays = progress.length;
  if (totalDays === 0) return 0;
  
  let successfulDays = 0;
  
  for (const record of progress) {
    if (record.value >= challenge.goalTarget) {
      successfulDays++;
    }
  }
  
  return Math.round((successfulDays / totalDays) * 100);
}; 