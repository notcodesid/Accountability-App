import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigationTypes';
import { AuthContext } from '../context/AuthContext';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  dummyChallenges,
  Participant,
  calculateChallengeCompletion
} from '../services/dummyData';

type LeaderboardScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Leaderboard'>;
  route: RouteProp<RootStackParamList, 'Leaderboard'>;
};

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ route, navigation }) => {
  const { challengeId } = route.params;
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<(Participant & { completionPercentage: number })[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [challengeTitle, setChallengeTitle] = useState('');
  const [filterOption, setFilterOption] = useState<'all' | 'friends'>('all');

  useEffect(() => {
    if (!user) return;
    
    loadLeaderboardData();
  }, [user, challengeId]);

  const loadLeaderboardData = () => {
    // Find the challenge
    const challenge = dummyChallenges.find(c => c.id === challengeId);
    
    if (!challenge) {
      setLoading(false);
      return;
    }
    
    setChallengeTitle(challenge.title);
    
    // Get participants with completion percentages
    const participantsWithCompletion = challenge.participants.map(participant => {
      const completionPercentage = calculateChallengeCompletion(
        participant.userId,
        challengeId
      );
      
      return {
        ...participant,
        completionPercentage
      };
    });
    
    // Sort by completion percentage (descending)
    const sortedParticipants = [...participantsWithCompletion].sort(
      (a, b) => b.completionPercentage - a.completionPercentage
    );
    
    setParticipants(sortedParticipants);
    
    // Find user's rank
    if (user) {
      const userIndex = sortedParticipants.findIndex(p => p.userId === user.id);
      if (userIndex !== -1) {
        setUserRank(userIndex + 1);
      }
    }
    
    setLoading(false);
  };
  
  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <View style={[styles.rankBadge, { backgroundColor: '#FFD700' }]}>
          <FontAwesome5 name="trophy" size={12} color="#FFF" />
          <Text style={styles.rankText}>{rank}</Text>
        </View>
      );
    } else if (rank === 2) {
      return (
        <View style={[styles.rankBadge, { backgroundColor: '#C0C0C0' }]}>
          <Text style={styles.rankText}>{rank}</Text>
        </View>
      );
    } else if (rank === 3) {
      return (
        <View style={[styles.rankBadge, { backgroundColor: '#CD7F32' }]}>
          <Text style={styles.rankText}>{rank}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>{rank}</Text>
        </View>
      );
    }
  };
  
  const renderParticipantItem = ({ item, index }: { item: Participant & { completionPercentage: number }, index: number }) => {
    const isCurrentUser = user?.id === item.userId;
    
    return (
      <View style={[
        styles.participantItem,
        isCurrentUser && styles.currentUserItem
      ]}>
        {getRankBadge(index + 1)}
        
        <View style={styles.participantInfo}>
          {item.user.profilePic ? (
            <Image source={{ uri: item.user.profilePic }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>
                {item.user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          
          <View style={styles.nameContainer}>
            <Text style={styles.participantName}>
              {item.user.name}
              {isCurrentUser && <Text style={styles.youLabel}> (You)</Text>}
            </Text>
            
            <View style={styles.streakContainer}>
              <MaterialCommunityIcons name="fire" size={14} color="#FF6B6B" />
              <Text style={styles.streakText}>
                {Math.floor(Math.random() * 10) + 1} day streak
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{item.completionPercentage}%</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${item.completionPercentage}%` }
              ]} 
            />
          </View>
        </View>
      </View>
    );
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Loading leaderboard...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Leaderboard</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.challengeInfoContainer}>
        <Text style={styles.challengeTitle}>{challengeTitle}</Text>
        <Text style={styles.participantsCount}>
          {participants.length} participants
        </Text>
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            filterOption === 'all' && styles.activeFilterButton
          ]}
          onPress={() => setFilterOption('all')}
        >
          <Text style={[
            styles.filterButtonText,
            filterOption === 'all' && styles.activeFilterButtonText
          ]}>All</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton,
            filterOption === 'friends' && styles.activeFilterButton
          ]}
          onPress={() => setFilterOption('friends')}
        >
          <Text style={[
            styles.filterButtonText,
            filterOption === 'friends' && styles.activeFilterButtonText
          ]}>Friends</Text>
        </TouchableOpacity>
      </View>
      
      {userRank !== null && (
        <View style={styles.userRankContainer}>
          <Text style={styles.userRankText}>
            Your current rank: <Text style={styles.rankHighlight}>#{userRank}</Text>
          </Text>
        </View>
      )}
      
      <FlatList
        data={participants}
        renderItem={renderParticipantItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4285F4',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  challengeInfoContainer: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  participantsCount: {
    fontSize: 14,
    color: '#666',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#F0F0F0',
  },
  activeFilterButton: {
    backgroundColor: '#4285F4',
  },
  filterButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  activeFilterButtonText: {
    color: 'white',
  },
  userRankContainer: {
    backgroundColor: '#EAF2FF',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  userRankText: {
    fontSize: 14,
    color: '#4285F4',
    fontWeight: '600',
  },
  rankHighlight: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    padding: 15,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  currentUserItem: {
    backgroundColor: '#EAF2FF',
    borderWidth: 1,
    borderColor: '#4285F4',
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E1E1E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarPlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  nameContainer: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  youLabel: {
    color: '#4285F4',
    fontWeight: '400',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  progressContainer: {
    alignItems: 'flex-end',
    width: 80,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  progressBar: {
    height: 6,
    width: '100%',
    backgroundColor: '#EEEEEE',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
});

export default LeaderboardScreen; 