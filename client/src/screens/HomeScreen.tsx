import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigationTypes';
import { AuthContext } from '../context/AuthContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { Challenge, getParticipatingChallenges, getAllChallenges } from '../services/dummyData';
import GradientBackground from '../components/GradientBackground';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { colors, spacing, components, shadows, borderRadius, fontSize } from '../config/theme';

// Extended User interface to include wallet
interface UserWithWallet {
  id: string;
  email: string;
  name: string;
  walletBalance?: number;
}

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
  route: RouteProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [availableChallenges, setAvailableChallenges] = useState<Challenge[]>([]);
  
  // Cast user to extended type with wallet
  const userWithWallet = user as UserWithWallet;
  
  useEffect(() => {
    loadChallenges();
  }, []);
  
  const loadChallenges = async () => {
    setLoading(true);
    try {
      // In a real app, these would be API calls
      const userChallenges = getParticipatingChallenges(user?.id || 'currentUser');
      const allChallenges = getAllChallenges();
      
      // Filter out challenges the user is already participating in
      const available = allChallenges.filter(
        challenge => !userChallenges.some(uc => uc.id === challenge.id)
      );
      
      setActiveChallenges(userChallenges);
      setAvailableChallenges(available);
    } catch (error) {
      console.error('Error loading challenges:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    loadChallenges();
  };
  
  const renderChallengeCard = ({ item }: { item: Challenge }) => {
    return (
      <Card
        variant="elevated"
        style={styles.card}
        onPress={() => navigation.navigate('ChallengeDetails', { challengeId: item.id })}
      >
        <Image
          source={{ uri: item.imageUrl || 'https://via.placeholder.com/400x200' }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Badge
              label={item.category}
              variant="primary"
              size="small"
              style={styles.categoryBadge}
            />
          </View>
          
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.cardStats}>
            <View style={styles.cardStat}>
              <FontAwesome5 name="calendar-alt" size={14} color={colors.primary} />
              <Text style={styles.cardStatText}>
                {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.cardStat}>
              <FontAwesome5 name="users" size={14} color={colors.primary} />
              <Text style={styles.cardStatText}>{item.participants.length} participants</Text>
            </View>
            
            <View style={styles.cardStat}>
              <FontAwesome5 name="dollar-sign" size={14} color={colors.primary} />
              <Text style={styles.cardStatText}>${item.entryFee} entry fee</Text>
            </View>
          </View>
        </View>
      </Card>
    );
  };
  
  if (loading && !refreshing) {
    return (
      <GradientBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading challenges...</Text>
        </View>
      </GradientBackground>
    );
  }
  
  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Accountability</Text>
            <Text style={styles.headerSubtitle}>Track your challenges and stay motivated</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => {
              // Type casting to fix TypeScript issue with navigation
              (navigation as any).navigate('Profile');
            }}
          >
            <FontAwesome5 name="user-circle" size={28} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={[]}
          ListHeaderComponent={() => (
            <View style={styles.listContent}>
              <View style={styles.walletCard}>
                <View style={styles.walletInfo}>
                  <Text style={styles.walletLabel}>Your Wallet</Text>
                  <Text style={styles.walletBalance}>${userWithWallet?.walletBalance || "0.00"}</Text>
                </View>
                <Button
                  title="Add Funds"
                  variant="secondary"
                  size="small"
                  icon="plus"
                  onPress={() => {
                    // Type casting to fix TypeScript issue with navigation
                    (navigation as any).navigate('Wallet');
                  }}
                />
              </View>
            
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Your Active Challenges</Text>
                <TouchableOpacity onPress={() => {
                  // Type casting to fix TypeScript issue with navigation
                  (navigation as any).navigate('RecordProgress', 
                    activeChallenges.length > 0 ? { challengeId: activeChallenges[0].id } : undefined);
                }}>
                  <Text style={styles.sectionAction}>Record Progress</Text>
                </TouchableOpacity>
              </View>
              
              {activeChallenges.length === 0 ? (
                <Card variant="outlined" style={styles.emptyStateCard}>
                  <View style={styles.emptyState}>
                    <FontAwesome5 name="flag" size={40} color={colors.textMuted} />
                    <Text style={styles.emptyStateText}>You haven't joined any challenges yet</Text>
                    <Text style={styles.emptyStateSubtext}>
                      Browse available challenges below or create your own
                    </Text>
                  </View>
                </Card>
              ) : (
                <FlatList
                  data={activeChallenges}
                  renderItem={renderChallengeCard}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalList}
                />
              )}
              
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Available Challenges</Text>
                <TouchableOpacity onPress={() => {
                  // Type casting to fix TypeScript issue with navigation
                  (navigation as any).navigate('CreateStack');
                }}>
                  <Text style={styles.sectionAction}>Create New</Text>
                </TouchableOpacity>
              </View>
              
              {availableChallenges.length === 0 ? (
                <Card variant="outlined" style={styles.emptyStateCard}>
                  <View style={styles.emptyState}>
                    <FontAwesome5 name="search" size={40} color={colors.textMuted} />
                    <Text style={styles.emptyStateText}>No available challenges found</Text>
                    <Button
                      title="Create a Challenge"
                      variant="gradient"
                      icon="plus"
                      onPress={() => {
                        // Type casting to fix TypeScript issue with navigation
                        (navigation as any).navigate('CreateStack');
                      }}
                      style={styles.createButton}
                    />
                  </View>
                </Card>
              ) : (
                <FlatList
                  data={availableChallenges}
                  renderItem={renderChallengeCard}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              )}
            </View>
          )}
          renderItem={() => null}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  profileButton: {
    padding: spacing.xs,
  },
  listContent: {
    padding: spacing.md,
  },
  walletCard: {
    backgroundColor: colors.cardAlt,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.medium,
  },
  walletInfo: {
    flex: 1,
  },
  walletLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  walletBalance: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  sectionHeader: {
    marginBottom: spacing.md,
    marginTop: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  sectionAction: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  emptyStateCard: {
    marginBottom: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  horizontalList: {
    paddingRight: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  cardContent: {
    padding: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  categoryBadge: {
    backgroundColor: colors.primary,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  cardStats: {
    flexDirection: 'column',
    marginTop: spacing.xs,
    backgroundColor: colors.cardDark,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  cardStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardStatText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  createButton: {
    marginTop: spacing.md,
  },
});

export default HomeScreen; 