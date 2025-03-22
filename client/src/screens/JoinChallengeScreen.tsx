import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  ScrollView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import {
  Challenge,
  getAvailableChallenges
} from '../services/dummyData';

type JoinChallengeScreenProps = NativeStackScreenProps<RootStackParamList, 'JoinChallenge'>;

const JoinChallengeScreen = ({ navigation }: JoinChallengeScreenProps) => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'steps' | 'workouts' | 'meditation' | 'custom'>('all');

  useEffect(() => {
    loadChallenges();
  }, [user]);

  useEffect(() => {
    filterChallenges();
  }, [searchQuery, selectedFilter, challenges]);

  const loadChallenges = () => {
    if (!user) return;
    
    // Get available challenges from dummy data
    const availableChallenges = getAvailableChallenges(user.id);
    setChallenges(availableChallenges);
    setLoading(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadChallenges();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const filterChallenges = () => {
    if (!challenges) return;

    let filtered = [...challenges];

    // Apply goal type filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(
        challenge => challenge.goalType.toLowerCase() === selectedFilter
      );
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        challenge => 
          challenge.title.toLowerCase().includes(query) || 
          challenge.description.toLowerCase().includes(query)
      );
    }

    setFilteredChallenges(filtered);
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
    const isUpcoming = new Date(item.startDate) > new Date();
    
    return (
      <TouchableOpacity 
        style={styles.challengeCard}
        onPress={() => navigation.navigate('ChallengeDetails', { challengeId: item.id })}
      >
        {isUpcoming && (
          <View style={styles.upcomingBadge}>
            <Text style={styles.upcomingBadgeText}>Upcoming</Text>
          </View>
        )}
        
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

        <View style={styles.creatorContainer}>
          <Text style={styles.creatorText}>
            Created by {item.creator.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterChip = (
    filter: 'all' | 'steps' | 'workouts' | 'meditation' | 'custom',
    label: string,
    icon: React.ReactNode
  ) => {
    const isSelected = selectedFilter === filter;
    
    return (
      <TouchableOpacity 
        style={[
          styles.filterChip,
          isSelected && styles.selectedFilterChip
        ]}
        onPress={() => setSelectedFilter(filter)}
      >
        {icon}
        <Text 
          style={[
            styles.filterChipText,
            isSelected && styles.selectedFilterChipText
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Loading challenges...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover Challenges</Text>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search challenges..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollContent}
        >
          {renderFilterChip('all', 'All', <FontAwesome5 name="list" size={14} color={selectedFilter === 'all' ? 'white' : '#4285F4'} />)}
          {renderFilterChip('steps', 'Steps', <FontAwesome5 name="walking" size={14} color={selectedFilter === 'steps' ? 'white' : '#4285F4'} />)}
          {renderFilterChip('workouts', 'Workouts', <FontAwesome5 name="dumbbell" size={14} color={selectedFilter === 'workouts' ? 'white' : '#4285F4'} />)}
          {renderFilterChip('meditation', 'Meditation', <FontAwesome5 name="spa" size={14} color={selectedFilter === 'meditation' ? 'white' : '#4285F4'} />)}
          {renderFilterChip('custom', 'Custom', <FontAwesome5 name="star" size={14} color={selectedFilter === 'custom' ? 'white' : '#4285F4'} />)}
        </ScrollView>
      </View>

      {filteredChallenges.length > 0 ? (
        <FlatList
          data={filteredChallenges}
          renderItem={renderChallengeItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="search" size={50} color="#ccc" />
          <Text style={styles.emptyTitle}>No challenges found</Text>
          <Text style={styles.emptyText}>
            Try adjusting your filters or search query
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filtersContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  filtersScrollContent: {
    paddingBottom: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF2FF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  selectedFilterChip: {
    backgroundColor: '#4285F4',
  },
  filterChipText: {
    color: '#4285F4',
    fontWeight: '600',
    marginLeft: 5,
  },
  selectedFilterChipText: {
    color: 'white',
  },
  listContainer: {
    padding: 20,
    paddingTop: 10,
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
  upcomingBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFC107',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 10,
  },
  upcomingBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
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
    lineHeight: 20,
  },
  challengeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  creatorContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  creatorText: {
    fontSize: 12,
    color: '#999',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  }
});

export default JoinChallengeScreen; 