import React, { useState } from 'react';
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
    rank: 24
  },
  achievements: [
    { id: '1', title: '10K Steps for 30 Days', date: '2024-03-15', icon: 'walk' as any },
    { id: '2', title: 'Meditation Master', date: '2024-02-28', icon: 'heart' as any },
    { id: '3', title: 'Code Challenge Champion', date: '2024-01-10', icon: 'code-slash' as any }
  ],
  wallet: {
    balance: 245.5,
    transactions: [
      { id: 't1', type: 'deposit', amount: 50, date: '2024-03-20', description: 'Challenge reward' },
      { id: 't2', type: 'deposit', amount: 75, date: '2024-03-15', description: 'Challenge reward' },
      { id: 't3', type: 'withdrawal', amount: -30, date: '2024-03-10', description: 'Challenge entry fee' },
      { id: 't4', type: 'deposit', amount: 100, date: '2024-03-05', description: 'Challenge reward' },
      { id: 't5', type: 'withdrawal', amount: -25, date: '2024-03-01', description: 'Challenge entry fee' }
    ]
  }
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState('achievements');
  const user = MOCK_USER;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'achievements':
        return (
          <View style={styles.tabContent}>
            {user.achievements.map(achievement => (
              <View key={achievement.id} style={styles.achievementItem}>
                <View style={styles.achievementIcon}>
                  <Ionicons name={achievement.icon as any} size={24} color={OnboardingColors.accentColor} />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDate}>{achievement.date}</Text>
                </View>
              </View>
            ))}
          </View>
        );
      case 'transactions':
        return (
          <View style={styles.tabContent}>
            {user.wallet.transactions.map(transaction => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={[
                  styles.transactionIcon, 
                  { backgroundColor: transaction.type === 'deposit' ? '#4CAF50' : '#F44336' }
                ]}>
                  <Ionicons 
                    name={transaction.type === 'deposit' ? 'arrow-down' : 'arrow-up'} 
                    size={18} 
                    color="#fff" 
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
                <Text style={[
                  styles.transactionAmount, 
                  { color: transaction.type === 'deposit' ? '#4CAF50' : '#F44336' }
                ]}>
                  {transaction.type === 'deposit' ? '+' : ''}{transaction.amount} SOL
                </Text>
              </View>
            ))}
          </View>
        );
      default:
        return <View style={styles.tabContent} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.safeAreaTop} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
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
        </View>

        {/* Wallet Card */}
        <View style={styles.walletCard}>
          <LinearGradient
            colors={['#2C3E50', '#4CA1AF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.walletGradient}
          >
            <View style={styles.walletHeader}>
              <Text style={styles.walletTitle}>Wallet Balance</Text>
              <Ionicons name="wallet-outline" size={24} color="#FFD700" />
            </View>
            <Text style={styles.walletBalance}>{user.wallet.balance} SOL</Text>
          </LinearGradient>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
            onPress={() => setActiveTab('achievements')}
          >
            <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
              Achievements
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
            onPress={() => setActiveTab('transactions')}
          >
            <Text style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>
              Transactions
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {renderTabContent()}
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
    height: 100,
    backgroundColor: HomeColors.background,
  },
  scrollView: {
    flex: 1,
  },
  coverContainer: {
    height: 200,
    position: 'relative',
    backgroundColor: HomeColors.challengeCard,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  coverGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  profileInfo: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: HomeColors.background,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 10,
  },
  bio: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: HomeColors.challengeCard,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 10,
    padding: 15,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  walletCard: {
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  walletGradient: {
    padding: 15,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  walletTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  walletBalance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: OnboardingColors.accentColor,
  },
  tabText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  tabContent: {
    padding: 15,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: HomeColors.challengeCard,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 87, 87, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
  },
  achievementDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: HomeColors.challengeCard,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 5,
  },
  transactionDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});