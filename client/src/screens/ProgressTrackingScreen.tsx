import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigationTypes';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import {
  getChallenge,
  getUserProgressRecords,
  calculateChallengeCompletion,
  Challenge,
  ProgressRecord
} from '../services/dummyData';

type ProgressTrackingScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ProgressTracking'>;
  route: RouteProp<RootStackParamList, 'ProgressTracking'>;
};

const ProgressTrackingScreen: React.FC<ProgressTrackingScreenProps> = ({ navigation, route }) => {
  const { challengeId } = route.params;
  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [progressRecords, setProgressRecords] = useState<ProgressRecord[]>([]);
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const challengeData = await getChallenge(challengeId);
        if (challengeData) {
          setChallenge(challengeData);
          
          // Get user progress records
          const records = getUserProgressRecords('currentUser', challengeId);
          setProgressRecords(records);
          
          // Calculate overall completion
          const completionPercentage = calculateChallengeCompletion('currentUser', challengeId);
          setCompletion(completionPercentage);
        } else {
          Alert.alert('Error', 'Challenge not found');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error loading progress data:', error);
        Alert.alert('Error', 'Failed to load progress data');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [challengeId, navigation]);

  const handleRecordProgress = () => {
    navigation.navigate('RecordProgress', { challengeId });
  };

  const getChallengeDaysTotal = (): number => {
    if (!challenge) return 0;
    
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    return daysDiff;
  };

  const getDaysCompleted = (): number => {
    if (!challenge) return 0;
    
    const startDate = new Date(challenge.startDate);
    const today = new Date();
    const endDate = new Date(challenge.endDate);
    const currentDate = today > endDate ? endDate : today;
    
    if (currentDate < startDate) return 0;
    
    const daysDiff = Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    return daysDiff;
  };

  const getGoalType = (type: string): string => {
    switch (type) {
      case 'steps': return 'Steps';
      case 'workout': return 'Workout Minutes';
      case 'meditation': return 'Meditation Minutes';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const getTotalProgress = (): number => {
    return progressRecords.reduce((sum, record) => sum + record.value, 0);
  };

  const getAverageProgress = (): number => {
    if (progressRecords.length === 0) return 0;
    return Math.round(getTotalProgress() / progressRecords.length);
  };

  const getProgressColor = (value: number, goal: number): string => {
    const ratio = value / goal;
    if (ratio >= 1) return '#4CAF50'; // Green
    if (ratio >= 0.7) return '#8BC34A'; // Light Green
    if (ratio >= 0.4) return '#FFC107'; // Amber
    return '#F44336'; // Red
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading progress data...</Text>
      </View>
    );
  }

  if (!challenge) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Challenge not found</Text>
        <TouchableOpacity 
          style={styles.errorButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
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
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Progress Tracking</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.challengeHeader}>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          <Text style={styles.goalTypeLabel}>
            {getGoalType(challenge.goalType)} Challenge
          </Text>
        </View>
        
        <View style={styles.summaryCard}>
          <View style={styles.progressCircleContainer}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressPercentage}>{completion}%</Text>
              <Text style={styles.progressLabel}>Complete</Text>
            </View>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{progressRecords.length}</Text>
              <Text style={styles.statLabel}>Days Logged</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{getDaysCompleted()}</Text>
              <Text style={styles.statLabel}>Days Elapsed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{getChallengeDaysTotal()}</Text>
              <Text style={styles.statLabel}>Total Days</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.financialCard}>
          <Text style={styles.sectionTitle}>Financial Summary</Text>
          <View style={styles.financeDetails}>
            <View style={styles.financeRow}>
              <FontAwesome5 name="ticket-alt" size={16} color="#007AFF" />
              <Text style={styles.financeLabel}>Your Stake</Text>
              <Text style={styles.financeValue}>${challenge.entryFee.toFixed(2)}</Text>
            </View>
            <View style={styles.financeRow}>
              <FontAwesome5 name="users" size={16} color="#007AFF" />
              <Text style={styles.financeLabel}>Participants</Text>
              <Text style={styles.financeValue}>{challenge.participants.length}</Text>
            </View>
            <View style={styles.financeRow}>
              <FontAwesome5 name="dollar-sign" size={16} color="#4CAF50" />
              <Text style={styles.financeLabel}>Total Pot</Text>
              <Text style={styles.financeValue}>
                ${(challenge.entryFee * challenge.participants.length).toFixed(2)}
              </Text>
            </View>
            <View style={styles.financeRow}>
              <FontAwesome5 name="trophy" size={16} color="#FF9800" />
              <Text style={styles.financeLabel}>Potential Reward</Text>
              <Text style={styles.financeValue}>
                ${(challenge.entryFee * challenge.participants.length).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.progressDetailsCard}>
          <View style={styles.progressDetailsHeader}>
            <Text style={styles.sectionTitle}>Progress Details</Text>
            <View style={styles.averageContainer}>
              <Text style={styles.averageLabel}>Average: </Text>
              <Text style={styles.averageValue}>
                {getAverageProgress()} {challenge.goalType === 'steps' ? 'steps' : 'mins'}/day
              </Text>
            </View>
          </View>
          
          <View style={styles.progressChartContainer}>
            {progressRecords.length > 0 ? (
              <>
                <View style={styles.chartContainer}>
                  {/* Simple visual representation of progress */}
                  {progressRecords.slice(0, 10).map((record, index) => (
                    <View key={record.id} style={styles.barChartItem}>
                      <Text style={styles.barChartDate}>{formatDate(record.date)}</Text>
                      <View style={styles.barContainer}>
                        <View 
                          style={[
                            styles.progressBar, 
                            { 
                              width: `${Math.min(record.value / challenge.goalValue * 100, 100)}%`,
                              backgroundColor: getProgressColor(record.value, challenge.goalValue)
                            }
                          ]} 
                        />
                      </View>
                      <Text style={styles.barChartValue}>{record.value}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.dataSubtitle}>
                  {progressRecords.length > 10 ? `Showing 10 of ${progressRecords.length} days` : `Showing all ${progressRecords.length} days`}
                </Text>
              </>
            ) : (
              <View style={styles.noDataContainer}>
                <FontAwesome5 name="chart-bar" size={40} color="#ccc" />
                <Text style={styles.noDataText}>No progress data recorded yet</Text>
                <Text style={styles.noDataSubtext}>
                  Start recording your daily progress to see it displayed here
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.recordButton}
          onPress={handleRecordProgress}
        >
          <FontAwesome5 name="plus-circle" size={16} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.recordButtonText}>Record Today's Progress</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  challengeHeader: {
    padding: 20,
    backgroundColor: '#fff',
  },
  challengeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  goalTypeLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  summaryCard: {
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressCircleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 12,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  progressLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
  },
  financialCard: {
    margin: 15,
    marginTop: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  financeDetails: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
  },
  financeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  financeLabel: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 1,
    marginLeft: 10,
  },
  financeValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  progressDetailsCard: {
    margin: 15,
    marginTop: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  averageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  averageLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  averageValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  progressChartContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
  },
  chartContainer: {
    marginVertical: 10,
  },
  barChartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  barChartDate: {
    width: 60,
    fontSize: 12,
    color: '#7f8c8d',
  },
  barContainer: {
    flex: 1,
    height: 16,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  barChartValue: {
    width: 50,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'right',
    marginLeft: 10,
  },
  dataSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 10,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginTop: 15,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    marginTop: 5,
  },
  recordButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    margin: 15,
    marginTop: 0,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonIcon: {
    marginRight: 10,
  },
  recordButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProgressTrackingScreen; 