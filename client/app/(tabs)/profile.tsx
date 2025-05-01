import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HomeColors, OnboardingColors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

// Mock user data
const MOCK_USER = {
  id: '1',
  name: 'siddharth',
  username: '@notcodesid',
  bio: 'Fitness enthusiast and challenge lover. Always up for a new adventure!',
  avatar: 'https://pbs.twimg.com/profile_images/1900043039831449603/EzgPL3sp_400x400.jpg',
  stats: {
    completedChallenges: 12,
    activeChallenges: 3,
    totalPoints: 8750,
    rank: 24
  },
  badges: [
    { id: '1', name: 'Early Adopter', icon: 'star' as any, color: '#FFD700' },
    { id: '2', name: 'Fitness Pro', icon: 'fitness' as any, color: '#FF4500' },
    { id: '3', name: 'Streak Master', icon: 'flame' as any, color: '#FF6347' },
    { id: '4', name: 'Community Leader', icon: 'people' as any, color: '#4169E1' }
  ],
  achievements: [
    { id: '1', title: '10K Steps for 30 Days', date: '2024-03-15', icon: 'walk' as any },
    { id: '2', title: 'Meditation Master', date: '2024-02-28', icon: 'heart' as any },
    { id: '3', title: 'Code Challenge Champion', date: '2024-01-10', icon: 'code-slash' as any }
  ],
  wallet: {
    balance: 245.5,
    currency: 'SOL',
    transactions: [
      { id: '1', type: 'deposit', amount: 100, date: '2024-04-15', description: 'Wallet funding' },
      { id: '2', type: 'withdraw', amount: -25, date: '2024-04-10', description: 'Challenge stake' },
      { id: '3', type: 'reward', amount: 75, date: '2024-03-28', description: 'Challenge reward' }
    ]
  }
};

export default function Profile() {
  const [user, setUser] = useState(MOCK_USER);
  const [activeTab, setActiveTab] = useState('achievements');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.safeAreaTop} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Cover Image and Profile Info */}
        <View style={styles.coverContainer}>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.coverGradient}
          />
          <View style={styles.profileInfo}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.bio}>{user.bio}</Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.stats.completedChallenges}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.stats.activeChallenges}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.stats.totalPoints}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>#{user.stats.rank}</Text>
            <Text style={styles.statLabel}>Rank</Text>
          </View>
        </View>

        {/* Wallet Card */}
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <Text style={styles.walletTitle}>Wallet Balance</Text>
            <TouchableOpacity style={styles.addFundsButton}>
              <Text style={styles.addFundsText}>Add Funds</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.walletBalance}>{user.wallet.balance} {user.wallet.currency}</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
            onPress={() => setActiveTab('achievements')}
          >
            <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>Achievements</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'badges' && styles.activeTab]}
            onPress={() => setActiveTab('badges')}
          >
            <Text style={[styles.tabText, activeTab === 'badges' && styles.activeTabText]}>Badges</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
            onPress={() => setActiveTab('transactions')}
          >
            <Text style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>Transactions</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'achievements' && (
            <>
              {user.achievements.map(achievement => (
                <View key={achievement.id} style={styles.achievementItem}>
                  <View style={styles.achievementIcon}>
                    <Ionicons name={achievement.icon as any} size={24} color={OnboardingColors.accentColor} />
                  </View>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDate}>
                      {new Date(achievement.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={HomeColors.textSecondary} />
                </View>
              ))}
            </>
          )}

          {activeTab === 'badges' && (
            <View style={styles.badgesGrid}>
              {user.badges.map(badge => (
                <View key={badge.id} style={styles.badgeItem}>
                  <View style={[styles.badgeIcon, { backgroundColor: badge.color }]}>
                    <Ionicons name={badge.icon as any} size={24} color="#fff" />
                  </View>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'transactions' && (
            <>
              {user.wallet.transactions.map(transaction => (
                <View key={transaction.id} style={styles.transactionItem}>
                  <View style={[
                    styles.transactionIcon,
                    { backgroundColor: transaction.type === 'deposit' || transaction.type === 'reward' ? '#4CAF50' : '#F44336' }
                  ]}>
                    <Ionicons 
                      name={transaction.type === 'deposit' ? 'arrow-down' : transaction.type === 'withdraw' ? 'arrow-up' : 'trophy'} 
                      size={20} 
                      color="#fff" 
                    />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionDescription}>{transaction.description}</Text>
                    <Text style={styles.transactionDate}>
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Text>
                  </View>
                  <Text style={[
                    styles.transactionAmount,
                    { color: transaction.type === 'deposit' || transaction.type === 'reward' ? '#4CAF50' : '#F44336' }
                  ]}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount} {user.wallet.currency}
                  </Text>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HomeColors.background,
  },
  safeAreaTop: {
    height: 50,
    backgroundColor: HomeColors.background,
  },
  scrollView: {
    flex: 1,
  },
  coverContainer: {
    height: 200,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
  },
  profileInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: HomeColors.background,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  username: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    maxWidth: '80%',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: HomeColors.challengeCard,
    borderRadius: 12,
    margin: 16,
    padding: 16,
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: HomeColors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: HomeColors.textSecondary,
  },
  walletCard: {
    backgroundColor: HomeColors.challengeCard,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  walletTitle: {
    fontSize: 16,
    color: HomeColors.textSecondary,
  },
  addFundsButton: {
    backgroundColor: OnboardingColors.accentColor,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  addFundsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  walletBalance: {
    fontSize: 28,
    fontWeight: 'bold',
    color: HomeColors.text,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: HomeColors.challengeCard,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'rgba(255, 87, 87, 0.2)',
  },
  tabText: {
    fontSize: 14,
    color: HomeColors.textSecondary,
  },
  activeTabText: {
    color: OnboardingColors.accentColor,
    fontWeight: '600',
  },
  tabContent: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: HomeColors.challengeCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 87, 87, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: HomeColors.text,
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
    color: HomeColors.textSecondary,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeItem: {
    width: '48%',
    backgroundColor: HomeColors.challengeCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  badgeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '600',
    color: HomeColors.text,
    textAlign: 'center',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: HomeColors.challengeCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: HomeColors.text,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: HomeColors.textSecondary,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});