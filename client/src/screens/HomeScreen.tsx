import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  RefreshControl,
  FlatList
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { 
  getActiveUserChallenges, 
  getUpcomingUserChallenges,
  calculateChallengeCompletion,
  Challenge
} from '../services/dummyData';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

// Use React Navigation's screen props type
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { user, logout } = useAuth();
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [upcomingChallenges, setUpcomingChallenges] = useState<Challenge[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadChallenges = () => {
    if (user) {
      setActiveChallenges(getActiveUserChallenges(user.id));
      setUpcomingChallenges(getUpcomingUserChallenges(user.id));
    }
  };

  useEffect(() => {
    loadChallenges();
  }, [user]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadChallenges();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getGoalTypeIcon = (goalType: Challenge['goalType']) => {
    switch (goalType) {
      case 'STEPS':
        return <FontAwesome5 name="walking" size={16} color="#4285F4" />;
      case 'WORKOUTS':
        return <FontAwesome5 name="dumbbell" size={16} color="#4285F4" />;
      case 'MEDITATION':
        return <FontAwesome5 name="spa" size={16} color="#4285F4" />;
      case 'CUSTOM':
        return <FontAwesome5 name="star" size={16} color="#4285F4" />;
      default:
        return <FontAwesome5 name="check" size={16} color="#4285F4" />;
    }
  };

  const renderChallengeItem = ({ item }: { item: Challenge }) => {
    const completionPercentage = user ? calculateChallengeCompletion(user.id, item.id) : 0;
    
    return (
      <TouchableOpacity 
        style={styles.challengeCard}
        onPress={() => navigation.navigate('ChallengeDetails', { challengeId: item.id })}
      >
        <View style={styles.challengeHeader}>
          <View style={styles.challengeTypeContainer}>
            {getGoalTypeIcon(item.goalType)}
            <Text style={styles.challengeType}>{item.goalType}</Text>
          </View>
          <Text style={styles.entryFee}>${item.entryFee}</Text>
        </View>

        <Text style={styles.challengeTitle}>{item.title}</Text>
        <Text style={styles.challengeDescription} numberOfLines={2}>{item.description}</Text>
        
        <View style={styles.challengeDetails}>
          <View style={styles.dateContainer}>
            <MaterialIcons name="date-range" size={14} color="#666" />
            <Text style={styles.dateText}>
              {formatDate(item.startDate)} - {formatDate(item.endDate)}
            </Text>
          </View>
          
          <View style={styles.participantsContainer}>
            <MaterialIcons name="people" size={14} color="#666" />
            <Text style={styles.participantsText}>
              {item.participants.length} participants
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${completionPercentage}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{completionPercentage}% complete</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderUpcomingChallengeItem = ({ item }: { item: Challenge }) => {
    return (
      <TouchableOpacity 
        style={styles.upcomingChallengeCard}
        onPress={() => navigation.navigate('ChallengeDetails', { challengeId: item.id })}
      >
        <View style={styles.upcomingChallengeBadge}>
          <Text style={styles.upcomingBadgeText}>Upcoming</Text>
        </View>
        
        <View style={styles.upcomingChallengeContent}>
          <View style={styles.upcomingChallengeIcon}>
            {getGoalTypeIcon(item.goalType)}
          </View>
          
          <View style={styles.upcomingChallengeDetails}>
            <Text style={styles.upcomingChallengeTitle}>{item.title}</Text>
            <Text style={styles.upcomingChallengeDate}>
              Starts: {formatDate(item.startDate)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Hello, {user?.name}!</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            {user?.profilePic ? (
              <Image source={{ uri: user.profilePic }} style={styles.profilePic} />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Text style={styles.profilePlaceholderText}>
                  {user?.name?.charAt(0).toUpperCase() || "?"}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.quickStatsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{activeChallenges.length}</Text>
            <Text style={styles.statLabel}>Active Challenges</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{upcomingChallenges.length}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>${activeChallenges.reduce((sum, c) => sum + c.entryFee, 0)}</Text>
            <Text style={styles.statLabel}>At Stake</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Challenges</Text>
            <TouchableOpacity onPress={() => navigation.navigate('JoinChallenge')}>
              <Text style={styles.sectionAction}>Find More</Text>
            </TouchableOpacity>
          </View>

          {activeChallenges.length > 0 ? (
            <FlatList
              data={activeChallenges}
              renderItem={renderChallengeItem}
              keyExtractor={item => item.id}
              horizontal={false}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <FontAwesome5 name="running" size={40} color="#ccc" />
              <Text style={styles.emptyStateText}>You don't have any active challenges</Text>
              <TouchableOpacity 
                style={styles.createButton}
                onPress={() => navigation.navigate('CreateChallenge')}
              >
                <Text style={styles.createButtonText}>Create Challenge</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {upcomingChallenges.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Challenges</Text>
            </View>

            <FlatList
              data={upcomingChallenges}
              renderItem={renderUpcomingChallengeItem}
              keyExtractor={item => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.upcomingList}
            />
          </View>
        )}

        <TouchableOpacity 
          style={styles.createChallengeButton}
          onPress={() => navigation.navigate('CreateChallenge')}
        >
          <Text style={styles.createChallengeButtonText}>Create New Challenge</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4285F4',
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
  },
  profilePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  profilePlaceholderText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -20,
  },
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  statNumber: {
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
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionAction: {
    fontSize: 14,
    color: '#4285F4',
  },
  challengeCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  challengeTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF2FF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  challengeType: {
    fontSize: 12,
    color: '#4285F4',
    marginLeft: 5,
    fontWeight: '600',
  },
  entryFee: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  challengeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantsText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  progressContainer: {
    marginTop: 5,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E5E5E5',
    borderRadius: 5,
    marginBottom: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 15,
  },
  createButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  upcomingChallengeCard: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 15,
    marginRight: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  upcomingChallengeBadge: {
    backgroundColor: '#FFC107',
    paddingVertical: 3,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    borderBottomRightRadius: 10,
  },
  upcomingBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  upcomingChallengeContent: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  upcomingChallengeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EAF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  upcomingChallengeDetails: {
    flex: 1,
  },
  upcomingChallengeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  upcomingChallengeDate: {
    fontSize: 12,
    color: '#666',
  },
  upcomingList: {
    paddingRight: 20,
  },
  createChallengeButton: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  createChallengeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default HomeScreen; 