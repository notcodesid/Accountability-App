import React, { useState, useEffect, useContext } from 'react';
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
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigationTypes';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { getChallenge, getUserProgress, joinChallenge, Challenge } from '../services/dummyData';
import { AuthContext } from '../context/AuthContext';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { colors, spacing, components, shadows, borderRadius, fontSize } from '../config/theme';
import { LinearGradient } from 'expo-linear-gradient';

// Extended User interface to include wallet
interface UserWithWallet {
  id: string;
  email: string;
  name: string;
  walletBalance?: number;
}

type ChallengeDetailsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ChallengeDetails'>;
  route: RouteProp<RootStackParamList, 'ChallengeDetails'>;
};

const ChallengeDetailsScreen: React.FC<ChallengeDetailsScreenProps> = ({ navigation, route }) => {
  const { challengeId } = route.params;
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [userProgress, setUserProgress] = useState<number>(0);
  const [isParticipant, setIsParticipant] = useState(false);

  // Cast user to extended type with wallet
  const userWithWallet = user as UserWithWallet;

  const loadData = async () => {
    try {
      const challengeData = await getChallenge(challengeId);
      if (challengeData) {
        setChallenge(challengeData);
        
        // Check if user is a participant
        const userParticipating = challengeData.participants.some(
          p => p.userId === (user?.id || 'currentUser')
        );
        setIsParticipant(userParticipating);
        
        if (userParticipating) {
          const progress = await getUserProgress(challengeId);
          setUserProgress(progress);
        }
      } else {
        Alert.alert('Error', 'Challenge not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading challenge details:', error);
      Alert.alert('Error', 'Failed to load challenge details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [challengeId, user?.id]);

  const handleJoinChallenge = async () => {
    if (!challenge) return;
    
    // Check if user has sufficient funds
    if (userWithWallet?.walletBalance !== undefined && userWithWallet.walletBalance < challenge.entryFee) {
      Alert.alert(
        "Insufficient Funds",
        `You need at least $${challenge.entryFee} in your wallet to join this challenge. Your current balance is $${userWithWallet.walletBalance.toFixed(2)}.`,
        [
          { text: "Add Funds", onPress: () => (navigation as any).navigate('Wallet') },
          { text: "Cancel", style: "cancel" }
        ]
      );
      return;
    }
    
    setJoining(true);
    try {
      await joinChallenge(challengeId);
      Alert.alert(
        "Successfully Joined Challenge!",
        `$${challenge.entryFee} has been deducted from your wallet and added to the challenge pool.`,
        [{ text: "OK" }]
      );
      // Reload data to update UI
      await loadData();
    } catch (error) {
      console.error('Error joining challenge:', error);
      Alert.alert('Error', 'Failed to join the challenge. Please try again later.');
    } finally {
      setJoining(false);
    }
  };

  const handleRecordProgress = () => {
    (navigation as any).navigate('RecordProgress', { challengeId });
  };

  const handleViewLeaderboard = () => {
    (navigation as any).navigate('Leaderboard', { challengeId });
  };

  const handleViewProgress = () => {
    (navigation as any).navigate('ProgressTracking', { challengeId });
  };

  const getGoalTypeText = (type: string, value: number) => {
    switch (type) {
      case 'steps':
        return `${value.toLocaleString()} steps daily`;
      case 'workout':
        return `${value} minutes workout per session`;
      case 'meditation':
        return `${value} minutes meditation daily`;
      case 'custom':
      default:
        return `${value} ${type}`;
    }
  };

  if (loading) {
    return (
      <GradientBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading challenge details...</Text>
        </View>
      </GradientBackground>
    );
  }

  if (!challenge) {
    return (
      <GradientBackground>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Challenge not found</Text>
          <Button
            title="Go Back"
            variant="primary"
            onPress={() => navigation.goBack()}
            icon="arrow-left"
          />
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Challenge Details</Text>
          <View style={{ width: 40 }} />
        </View>
        
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
          <View style={styles.challengeImageContainer}>
            <Image
              source={{ uri: challenge.imageUrl || 'https://via.placeholder.com/400x200' }}
              style={styles.challengeImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', colors.backgroundDarker]}
              style={styles.imageGradient}
            />
            <View style={styles.tagContainer}>
              <Badge
                label={challenge.category}
                variant="primary"
                size="small"
              />
            </View>
          </View>
          
          <Card variant="elevated" style={styles.challengeCard}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <FontAwesome5 name="calendar-alt" size={16} color={colors.primary} />
                <Text style={styles.statText}>
                  {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.statItem}>
                <FontAwesome5 name="users" size={16} color={colors.primary} />
                <Text style={styles.statText}>{challenge.participants.length} Participants</Text>
              </View>
            </View>
            
            {isParticipant && (
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressTitle}>Your Progress</Text>
                  <Text style={styles.progressPercent}>{userProgress}%</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: `${userProgress}%`, backgroundColor: userProgress > 66 ? components.progressBar.success : userProgress > 33 ? components.progressBar.primary : components.progressBar.warning }
                    ]} 
                  />
                </View>
              </View>
            )}
            
            <Card variant="outlined" style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{challenge.description}</Text>
            </Card>
            
            <Card variant="outlined" style={styles.section}>
              <Text style={styles.sectionTitle}>Goal</Text>
              <View style={styles.goalContainer}>
                <FontAwesome5 
                  name={
                    challenge.goalType === 'steps' ? 'walking' : 
                    challenge.goalType === 'workout' ? 'dumbbell' : 
                    challenge.goalType === 'meditation' ? 'spa' : 'star'
                  } 
                  size={20} 
                  color={colors.primary} 
                />
                <Text style={styles.goalText}>
                  {getGoalTypeText(challenge.goalType, challenge.goalValue)}
                </Text>
              </View>
            </Card>
            
            <Card variant="outlined" style={styles.section}>
              <Text style={styles.sectionTitle}>Financial Details</Text>
              <View style={styles.financeContainer}>
                <View style={styles.financeItem}>
                  <FontAwesome5 name="ticket-alt" size={16} color={colors.primary} />
                  <Text style={styles.financeText}>Entry Fee: ${challenge.entryFee.toFixed(2)}</Text>
                </View>
                <View style={styles.financeItem}>
                  <FontAwesome5 name="dollar-sign" size={16} color={colors.success} />
                  <Text style={styles.financeText}>
                    Pot Size: ${(challenge.entryFee * challenge.participants.length).toFixed(2)}
                  </Text>
                </View>
                {isParticipant && (
                  <View style={styles.financeItem}>
                    <FontAwesome5 name="trophy" size={16} color={colors.warning} />
                    <Text style={styles.financeText}>
                      Potential Reward: ${(challenge.entryFee * challenge.participants.length).toFixed(2)}
                    </Text>
                  </View>
                )}
              </View>
            </Card>
            
            <View style={styles.buttonsContainer}>
              {isParticipant ? (
                <>
                  <Button
                    title="Record Progress"
                    variant="gradient"
                    onPress={handleRecordProgress}
                    icon="plus-circle"
                    style={styles.actionButton}
                    fullWidth
                    size="large"
                  />
                  
                  <View style={styles.buttonRow}>
                    <Button
                      title="Leaderboard"
                      variant="secondary"
                      onPress={handleViewLeaderboard}
                      icon="trophy"
                      style={styles.secondaryButton}
                    />
                    
                    <Button
                      title="Progress"
                      variant="secondary"
                      onPress={handleViewProgress}
                      icon="chart-line"
                      style={styles.secondaryButton}
                    />
                  </View>
                </>
              ) : (
                <Button
                  title={`Join Challenge ($${challenge.entryFee})`}
                  variant="gradient"
                  onPress={handleJoinChallenge}
                  isLoading={joining}
                  icon="handshake"
                  style={styles.actionButton}
                  fullWidth
                  size="large"
                />
              )}
            </View>
          </Card>
        </ScrollView>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.round,
    backgroundColor: colors.cardDark,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 18,
    color: colors.danger,
    marginBottom: spacing.md,
  },
  challengeImageContainer: {
    position: 'relative',
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.medium,
  },
  challengeImage: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.lg,
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  tagContainer: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  challengeCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.medium,
  },
  challengeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
    marginBottom: spacing.sm,
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  progressContainer: {
    backgroundColor: colors.cardDark,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.backgroundLighter,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardDark,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  goalText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: spacing.md,
    fontWeight: '500',
  },
  financeContainer: {
    backgroundColor: colors.cardDark,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  financeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  financeText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  buttonsContainer: {
    marginTop: spacing.lg,
  },
  actionButton: {
    marginBottom: spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flex: 0.48,
  },
});

export default ChallengeDetailsScreen; 