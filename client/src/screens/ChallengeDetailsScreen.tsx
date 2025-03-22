import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import {
  Challenge,
  dummyChallenges,
  calculateChallengeCompletion,
  getUserChallengeProgress,
  ProgressRecord
} from '../services/dummyData';

type ChallengeDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'ChallengeDetails'>;

const ChallengeDetailsScreen = ({ route, navigation }: ChallengeDetailsScreenProps) => {
  const { challengeId } = route.params;
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<ProgressRecord[] | null>(null);
  const [completionRate, setCompletionRate] = useState(0);
  const [isParticipating, setIsParticipating] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  
  useEffect(() => {
    loadChallengeData();
  }, [challengeId, user]);
  
  const loadChallengeData = () => {
    if (!user) return;
    
    // Find the challenge in our dummy data
    const foundChallenge = dummyChallenges.find(c => c.id === challengeId);
    
    if (foundChallenge) {
      setChallenge(foundChallenge);
      
      // Check if user is participating in this challenge
      const participating = foundChallenge.participants.some(p => p.userId === user.id);
      setIsParticipating(participating);
      
      // Check if user is the creator
      setIsCreator(foundChallenge.creatorId === user.id);
      
      // Get user progress if participating
      if (participating) {
        const progress = getUserChallengeProgress(user.id, challengeId);
        setUserProgress(progress);
        
        // Calculate completion rate
        const completion = calculateChallengeCompletion(user.id, challengeId);
        setCompletionRate(completion);
      }
    }
    
    setLoading(false);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const handleJoinChallenge = () => {
    Alert.alert(
      'Join Challenge',
      `Join this challenge for $${challenge?.entryFee}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Join',
          onPress: () => {
            // In a real app, this would call an API to join the challenge
            Alert.alert('Success', 'You have joined the challenge successfully!');
            setIsParticipating(true);
          }
        }
      ]
    );
  };
  
  const getGoalTypeIcon = (goalType: Challenge['goalType']) => {
    switch (goalType) {
      case 'STEPS':
        return <FontAwesome5 name="walking" size={24} color="#4285F4" />;
      case 'WORKOUTS':
        return <FontAwesome5 name="dumbbell" size={24} color="#4285F4" />;
      case 'MEDITATION':
        return <FontAwesome5 name="spa" size={24} color="#4285F4" />;
      case 'CUSTOM':
        return <FontAwesome5 name="star" size={24} color="#4285F4" />;
      default:
        return <FontAwesome5 name="check" size={24} color="#4285F4" />;
    }
  };
  
  const getGoalTypeUnit = (goalType: Challenge['goalType']) => {
    switch (goalType) {
      case 'STEPS':
        return 'steps';
      case 'WORKOUTS':
        return 'workouts';
      case 'MEDITATION':
        return 'minutes';
      case 'CUSTOM':
        return 'units';
      default:
        return 'units';
    }
  };
  
  const renderParticipants = () => {
    if (!challenge) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Participants ({challenge.participants.length})</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.participantsList}
        >
          {challenge.participants.map(participant => (
            <View key={participant.id} style={styles.participantItem}>
              {participant.user.profilePic ? (
                <Image 
                  source={{ uri: participant.user.profilePic }} 
                  style={styles.participantAvatar} 
                />
              ) : (
                <View style={styles.participantAvatarPlaceholder}>
                  <Text style={styles.participantAvatarText}>
                    {participant.user.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <Text style={styles.participantName} numberOfLines={1}>
                {participant.user.name}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Loading challenge details...</Text>
      </View>
    );
  }
  
  if (!challenge) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#f44336" />
        <Text style={styles.errorText}>Challenge not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const isActive = new Date(challenge.startDate) <= new Date() && new Date(challenge.endDate) >= new Date();
  const isUpcoming = new Date(challenge.startDate) > new Date();
  const isCompleted = new Date(challenge.endDate) < new Date();
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity 
            style={styles.backButtonIcon}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          {isActive && (
            <View style={[styles.statusBadge, styles.activeBadge]}>
              <Text style={styles.statusText}>Active</Text>
            </View>
          )}
          
          {isUpcoming && (
            <View style={[styles.statusBadge, styles.upcomingBadge]}>
              <Text style={styles.statusText}>Upcoming</Text>
            </View>
          )}
          
          {isCompleted && (
            <View style={[styles.statusBadge, styles.completedBadge]}>
              <Text style={styles.statusText}>Completed</Text>
            </View>
          )}
        </View>
        
        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            {getGoalTypeIcon(challenge.goalType)}
          </View>
          <Text style={styles.title}>{challenge.title}</Text>
        </View>
        
        <Text style={styles.description}>{challenge.description}</Text>
        
        <View style={styles.metaInfo}>
          <View style={styles.metaItem}>
            <MaterialIcons name="date-range" size={18} color="white" />
            <Text style={styles.metaText}>
              {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
            </Text>
          </View>
          
          <View style={styles.metaItem}>
            <MaterialIcons name="person" size={18} color="white" />
            <Text style={styles.metaText}>
              Created by {challenge.creator.name}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{challenge.goalTarget}</Text>
            <Text style={styles.statLabel}>
              Daily target ({getGoalTypeUnit(challenge.goalType)})
            </Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>${challenge.entryFee}</Text>
            <Text style={styles.statLabel}>Entry fee</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{challenge.participants.length}</Text>
            <Text style={styles.statLabel}>Participants</Text>
          </View>
        </View>
        
        {isParticipating && userProgress && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${completionRate}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {completionRate}% complete
            </Text>
            
            <TouchableOpacity 
              style={styles.progressActionButton}
              onPress={() => navigation.navigate('ProgressTracking', { challengeId: challenge.id })}
            >
              <Text style={styles.progressActionButtonText}>View Progress Details</Text>
            </TouchableOpacity>
            
            {isActive && (
              <TouchableOpacity 
                style={styles.recordButton}
                onPress={() => navigation.navigate('RecordProgress', { challengeId: challenge.id })}
              >
                <MaterialIcons name="add-circle" size={18} color="white" />
                <Text style={styles.recordButtonText}>Record Today's Progress</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        
        {renderParticipants()}
        
        {!isParticipating && !isCreator && !isCompleted && (
          <TouchableOpacity
            style={styles.joinButton}
            onPress={handleJoinChallenge}
          >
            <Text style={styles.joinButtonText}>Join Challenge</Text>
          </TouchableOpacity>
        )}
        
        {isParticipating && (
          <TouchableOpacity
            style={styles.leaderboardButton}
            onPress={() => navigation.navigate('Leaderboard', { challengeId: challenge.id })}
          >
            <FontAwesome5 name="trophy" size={18} color="white" />
            <Text style={styles.leaderboardButtonText}>View Leaderboard</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#4285F4',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  activeBadge: {
    backgroundColor: '#4CAF50',
  },
  upcomingBadge: {
    backgroundColor: '#FFC107',
  },
  completedBadge: {
    backgroundColor: '#9E9E9E',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
    lineHeight: 24,
  },
  metaInfo: {
    marginTop: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 14,
  },
  content: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4285F4',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E5E5E5',
    borderRadius: 6,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  progressActionButton: {
    backgroundColor: '#EAF2FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  progressActionButtonText: {
    color: '#4285F4',
    fontWeight: '600',
  },
  recordButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
  },
  recordButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  participantsList: {
    paddingBottom: 10,
  },
  participantItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 70,
  },
  participantAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  participantAvatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E1E1E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  participantAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  participantName: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  joinButton: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  joinButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  leaderboardButton: {
    backgroundColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  leaderboardButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default ChallengeDetailsScreen; 