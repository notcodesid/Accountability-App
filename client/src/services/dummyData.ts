import { User } from './auth';

export type Challenge = {
  id: string;
  title: string;
  description: string;
  category: string;
  goalType: 'steps' | 'workout' | 'meditation' | 'custom';
  goalValue: number;
  entryFee: number;
  potSize?: number;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  createdBy: string;
  imageUrl?: string;
  participants: ChallengeParticipant[];
};

export type ChallengeParticipant = {
  id: string;
  userId: string;
  challengeId: string;
  joinedAt: string;
  user: User;
};

export type ProgressRecord = {
  id: string;
  userId: string;
  challengeId: string;
  date: string;
  value: number;
  notes?: string;
};

// Dummy users
export const dummyUsers: User[] = [
  {
    id: 'u1',
    name: 'John Doe',
    email: 'john@example.com',
    profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
    walletBalance: 150
  },
  {
    id: 'u2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    profilePic: 'https://randomuser.me/api/portraits/women/2.jpg',
    walletBalance: 220
  },
  {
    id: 'u3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    profilePic: 'https://randomuser.me/api/portraits/men/3.jpg',
    walletBalance: 75
  },
  {
    id: 'u4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    profilePic: 'https://randomuser.me/api/portraits/women/4.jpg',
    walletBalance: 180
  },
  {
    id: 'u5',
    name: 'Alex Brown',
    email: 'alex@example.com',
    profilePic: 'https://randomuser.me/api/portraits/men/5.jpg',
    walletBalance: 95
  },
  {
    id: 'currentUser',
    name: 'You',
    email: 'you@example.com',
    profilePic: 'https://randomuser.me/api/portraits/men/42.jpg',
    walletBalance: 100
  }
];

// Dummy challenges
export const dummyChallenges: Challenge[] = [
  {
    id: 'c1',
    title: '30-Day Fitness Challenge',
    description: 'Complete 30 minutes of exercise every day for 30 days. Track your progress and compete with friends!',
    category: 'Fitness',
    goalType: 'workout',
    goalValue: 30,
    entryFee: 20,
    potSize: 100,
    startDate: '2023-06-01',
    endDate: '2023-06-30',
    isPublic: true,
    createdBy: 'u1',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    participants: []
  },
  {
    id: 'c2',
    title: 'Early Bird Morning Routine',
    description: 'Wake up at 6am every day and complete a morning routine including meditation, exercise, and journaling.',
    category: 'Lifestyle',
    goalType: 'meditation',
    goalValue: 15,
    entryFee: 15,
    potSize: 75,
    startDate: '2023-06-15',
    endDate: '2023-07-15',
    isPublic: true,
    createdBy: 'u2',
    imageUrl: 'https://images.unsplash.com/photo-1506377711776-dbdc2f3c20d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    participants: []
  },
  {
    id: 'c3',
    title: '10K Steps Daily',
    description: 'Challenge yourself to walk 10,000 steps every day for a month. Great for health and wellness!',
    category: 'Health',
    goalType: 'steps',
    goalValue: 10000,
    entryFee: 10,
    potSize: 50,
    startDate: '2023-07-01',
    endDate: '2023-07-31',
    isPublic: true,
    createdBy: 'u3',
    imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    participants: []
  },
  {
    id: 'c4',
    title: 'Reading Marathon',
    description: 'Read for at least 30 minutes every day for 21 days to form a lasting habit.',
    category: 'Education',
    goalType: 'custom',
    goalValue: 30,
    entryFee: 5,
    potSize: 25,
    startDate: '2023-06-20',
    endDate: '2023-07-10',
    isPublic: false,
    createdBy: 'u4',
    imageUrl: 'https://images.unsplash.com/photo-1513001900722-370f803f498d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
    participants: []
  },
  {
    id: 'c5',
    title: 'Water Drinking Challenge',
    description: 'Drink at least 2 liters of water every day for 14 days to improve hydration and health.',
    category: 'Health',
    goalType: 'custom',
    goalValue: 2,
    entryFee: 8,
    potSize: 10,
    startDate: '2023-06-10',
    endDate: '2023-06-24',
    isPublic: true,
    createdBy: 'u5',
    imageUrl: 'https://images.unsplash.com/photo-1502740479091-635887520276?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80',
    participants: []
  }
];

// Initialize participants
dummyChallenges.forEach(challenge => {
  // Add the creator as a participant
  const creatorUser = dummyUsers.find(user => user.id === challenge.createdBy)!;
  
  challenge.participants.push({
    id: `p_${challenge.id}_${challenge.createdBy}`,
    userId: challenge.createdBy,
    challengeId: challenge.id,
    joinedAt: new Date(challenge.startDate).toISOString(),
    user: creatorUser
  });
  
  // Add some random participants including the current user
  const potentialParticipants = dummyUsers
    .filter(user => user.id !== challenge.createdBy)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3 + Math.floor(Math.random() * 3)); // 3-5 random participants
  
  potentialParticipants.forEach(user => {
    challenge.participants.push({
      id: `p_${challenge.id}_${user.id}`,
      userId: user.id,
      challengeId: challenge.id,
      joinedAt: new Date(challenge.startDate).toISOString(),
      user: user
    });
  });
  
  // Make sure currentUser is in at least the first few challenges
  if (challenge.id === 'c1' || challenge.id === 'c2' || challenge.id === 'c3') {
    const currentUserAlreadyParticipant = challenge.participants.some(p => p.userId === 'currentUser');
    
    if (!currentUserAlreadyParticipant) {
      const currentUser = dummyUsers.find(user => user.id === 'currentUser')!;
      challenge.participants.push({
        id: `p_${challenge.id}_currentUser`,
        userId: 'currentUser',
        challengeId: challenge.id,
        joinedAt: new Date(challenge.startDate).toISOString(),
        user: currentUser
      });
    }
  }
});

// Dummy progress records
const dummyProgress: ProgressRecord[] = [];

// Generate progress records for participants
dummyChallenges.forEach(challenge => {
  challenge.participants.forEach(participant => {
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);
    const today = new Date();
    const actualEndDate = endDate < today ? endDate : today;
    
    let currentDate = new Date(startDate);
    
    while (currentDate <= actualEndDate) {
      // Skip some days randomly to make data more realistic
      if (Math.random() > 0.2) {
        // Create a progress record for this day
        const goalCompletion = Math.random();
        const progressValue = Math.round(challenge.goalValue * (0.5 + goalCompletion * 0.8));
        
        dummyProgress.push({
          id: `progress_${participant.userId}_${challenge.id}_${currentDate.toISOString().split('T')[0]}`,
          userId: participant.userId,
          challengeId: challenge.id,
          date: currentDate.toISOString().split('T')[0],
          value: progressValue,
          notes: Math.random() > 0.7 ? 'Feeling good about my progress today!' : undefined
        });
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });
});

// Helper function to calculate completion percentage for a user in a challenge
export const calculateChallengeCompletion = (userId: string, challengeId: string): number => {
  const challenge = dummyChallenges.find(c => c.id === challengeId);
  if (!challenge) return 0;
  
  const userProgressRecords = dummyProgress.filter(
    record => record.userId === userId && record.challengeId === challengeId
  );
  
  if (userProgressRecords.length === 0) return 0;
  
  // Calculate days between start and end (or today if challenge is ongoing)
  const startDate = new Date(challenge.startDate);
  const endDate = new Date(challenge.endDate);
  const today = new Date();
  const actualEndDate = endDate < today ? endDate : today;
  
  const daysBetween = Math.ceil((actualEndDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Calculate the expected total progress
  const expectedTotal = challenge.goalValue * daysBetween;
  
  // Calculate the actual total progress
  const actualTotal = userProgressRecords.reduce((sum, record) => sum + record.value, 0);
  
  // Calculate the percentage
  const percentage = Math.round((actualTotal / expectedTotal) * 100);
  
  // Cap at 100%
  return Math.min(percentage, 100);
};

// Utility functions to get data

// Get user by ID
export const getUser = (userId: string): User | undefined => {
  return dummyUsers.find(user => user.id === userId);
};

// Get current user
export const getCurrentUser = (): User => {
  return dummyUsers.find(user => user.id === 'currentUser')!;
};

// Get all challenges
export const getAllChallenges = (): Challenge[] => {
  return [...dummyChallenges];
};

// Get challenge by ID
export const getChallenge = async (challengeId: string): Promise<Challenge | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return dummyChallenges.find(challenge => challenge.id === challengeId);
};

// Get challenges created by user
export const getChallengesByUser = (userId: string): Challenge[] => {
  return dummyChallenges.filter(challenge => challenge.createdBy === userId);
};

// Get challenges user is participating in
export const getParticipatingChallenges = (userId: string): Challenge[] => {
  return dummyChallenges.filter(challenge =>
    challenge.participants.some(participant => participant.userId === userId)
  );
};

// Get user progress for a specific challenge
export const getUserProgress = async (challengeId: string, userId: string = 'currentUser'): Promise<number> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return calculateChallengeCompletion(userId, challengeId);
};

// Get progress records for a user in a challenge
export const getUserProgressRecords = (userId: string, challengeId: string): ProgressRecord[] => {
  return dummyProgress.filter(
    record => record.userId === userId && record.challengeId === challengeId
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get participants for a challenge sorted by completion percentage
export const getLeaderboard = async (challengeId: string): Promise<ChallengeParticipant[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const challenge = dummyChallenges.find(c => c.id === challengeId);
  if (!challenge) return [];
  
  return [...challenge.participants].sort((a, b) => {
    const completionA = calculateChallengeCompletion(a.userId, challengeId);
    const completionB = calculateChallengeCompletion(b.userId, challengeId);
    return completionB - completionA;
  });
};

// Create a new challenge
export const createChallenge = async (challengeData: Partial<Challenge>): Promise<Challenge> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newId = `c${dummyChallenges.length + 1}`;
  const currentUser = getCurrentUser();
  
  const newChallenge: Challenge = {
    id: newId,
    title: challengeData.title || 'New Challenge',
    description: challengeData.description || '',
    category: challengeData.category || 'Other',
    goalType: challengeData.goalType || 'custom',
    goalValue: challengeData.goalValue || 1,
    entryFee: challengeData.entryFee || 0,
    potSize: challengeData.potSize,
    startDate: challengeData.startDate || new Date().toISOString().split('T')[0],
    endDate: challengeData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isPublic: challengeData.isPublic ?? true,
    createdBy: currentUser.id,
    imageUrl: challengeData.imageUrl,
    participants: [{
      id: `p_${newId}_${currentUser.id}`,
      userId: currentUser.id,
      challengeId: newId,
      joinedAt: new Date().toISOString(),
      user: currentUser
    }]
  };
  
  dummyChallenges.push(newChallenge);
  return newChallenge;
};

// Join a challenge
export const joinChallenge = async (challengeId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const challenge = dummyChallenges.find(c => c.id === challengeId);
  if (!challenge) throw new Error('Challenge not found');
  
  const currentUser = getCurrentUser();
  
  // Check if already participating
  const alreadyParticipating = challenge.participants.some(p => p.userId === currentUser.id);
  if (alreadyParticipating) throw new Error('Already participating in this challenge');
  
  // Check if user has enough balance
  if (currentUser.walletBalance < challenge.entryFee) {
    throw new Error('Insufficient balance to join this challenge');
  }
  
  // Add user to participants
  challenge.participants.push({
    id: `p_${challengeId}_${currentUser.id}`,
    userId: currentUser.id,
    challengeId: challenge.id,
    joinedAt: new Date().toISOString(),
    user: currentUser
  });
  
  // Deduct entry fee
  currentUser.walletBalance -= challenge.entryFee;
};

// Record progress
export const recordProgress = async (challengeId: string, value: number, notes?: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const challenge = dummyChallenges.find(c => c.id === challengeId);
  if (!challenge) throw new Error('Challenge not found');
  
  const currentUser = getCurrentUser();
  
  // Check if participating
  const isParticipating = challenge.participants.some(p => p.userId === currentUser.id);
  if (!isParticipating) throw new Error('Not participating in this challenge');
  
  // Add progress record
  const today = new Date().toISOString().split('T')[0];
  
  // Check if already recorded today
  const alreadyRecordedToday = dummyProgress.some(
    p => p.userId === currentUser.id && p.challengeId === challengeId && p.date === today
  );
  
  if (alreadyRecordedToday) {
    // Update existing record
    const existingRecord = dummyProgress.find(
      p => p.userId === currentUser.id && p.challengeId === challengeId && p.date === today
    );
    
    if (existingRecord) {
      existingRecord.value = value;
      existingRecord.notes = notes;
    }
  } else {
    // Create new record
    dummyProgress.push({
      id: `progress_${currentUser.id}_${challengeId}_${today}`,
      userId: currentUser.id,
      challengeId: challengeId,
      date: today,
      value: value,
      notes: notes
    });
  }
}; 