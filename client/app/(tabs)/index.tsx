import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  ListRenderItem,
  StatusBar,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { HomeColors, OnboardingColors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useRouter } from 'expo-router';

interface Challenge {
  id: string;
  title: string;
  image: string;
  duration: string;
  participants: number;
  difficulty: string;
  userStake: number;
  totalPrizePool: number;
  type: string;
  hostType: 'ORG' | 'FRIEND';
  sponsor?: string;
  creator?: string;
  metrics?: string;
  trackingMetrics?: string[];
}

export default function Home() {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const mockChallenges: Challenge[] = [
      {
        id: "1",
        title: 'Nike Move Marathon',
        type: 'Fitness',
        hostType: 'ORG',
        sponsor: 'Nike',
        duration: '30 days',
        difficulty: "MODERATE",
        userStake: 1.5,
        totalPrizePool: 100,
        participants: 100,
        metrics: "Steps",
        trackingMetrics: ["steps"],
        image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77',
      },
      {
        id: "2",
        title: 'Headspace Mindfulness Sprint',
        type: 'Mental Health',
        hostType: 'ORG',
        sponsor: 'Headspace',
        duration: '21 days',
        difficulty: "EASY",
        userStake: 1,
        totalPrizePool: 200,
        participants: 300,
        metrics: "Minutes",
        trackingMetrics: ["meditation_minutes"],
        image: 'https://images.unsplash.com/photo-1606639386701-f3826670507c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        id: "3",
        title: 'Code Daily Crew Challenge',
        type: 'Programming',
        hostType: 'FRIEND',
        creator: 'Sarah_Dev',
        duration: '45 days',
        difficulty: "HARD",
        userStake: 2,
        totalPrizePool: 21.6,
        participants: 12,
        metrics: "Code Commits",
        trackingMetrics: ["github_commits"],
        image: 'https://images.unsplash.com/photo-1619410283995-43d9134e7656',
      },
      {
        id: "4",
        title: 'Vegan30 Squad',
        type: 'Lifestyle',
        hostType: 'FRIEND',
        creator: 'EcoMike',
        duration: '30 days',
        difficulty: "MODERATE",
        userStake: 1.2,
        totalPrizePool: 10.8,
        participants: 10,
        metrics: "Check-ins",
        trackingMetrics: ["meal_photos", "community_votes"],
        image: 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7',
      }
    ];

    setChallenges(mockChallenges);
    setLoading(false);
  }, []);

  const onRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const renderChallengeItem: ListRenderItem<Challenge> = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.challengeCard,
        selectedChallenge === item.id && styles.selectedChallengeCard
      ]}
      onPress={() =>
        setSelectedChallenge(selectedChallenge === item.id ? null : item.id)
      }
    >
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.challengeImage}
        imageStyle={styles.imageStyle}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <View style={styles.challengeHeader}>
            <Text style={styles.challengeTitle}>{item.title}</Text>
            {item.metrics && <Text style={styles.metricsText}>{item.metrics}</Text>}
          </View>
        </LinearGradient>
      </ImageBackground>

      <View style={styles.challengeDetails}>
        <View style={styles.hostContainer}>
          <Ionicons 
            name={item.hostType === 'ORG' ? 'business' : 'people'} 
            size={14} 
            color={HomeColors.text} 
          />
          <Text style={styles.hostText}>
            {item.hostType === 'ORG' 
              ? `Sponsored by ${item.sponsor}`
              : `Created by ${item.creator}`}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar" size={14} color={HomeColors.text} />
            <Text style={styles.detailText}>{item.duration}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="people" size={14} color={HomeColors.text} />
            <Text style={styles.detailText}>{item.participants} participants</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="wallet" size={14} color={HomeColors.text} />
            <Text style={styles.detailText}>Stake: {item.userStake} SOL</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="trophy" size={14} color={HomeColors.text} />
            <Text style={styles.detailText}>Prize: {item.totalPrizePool} SOL</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Something went wrong!</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.safeAreaTop} />
      <View style={styles.mainContainer}>
        <FlatList
          data={challenges}
          keyExtractor={(item) => item.id}
          renderItem={renderChallengeItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
      {selectedChallenge && (
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity 
            style={styles.selectButton}
            onPress={() => router.push(`/challenges/${selectedChallenge}`)}
          >
            <Text style={styles.selectButtonText}>Start Challenge</Text>
          </TouchableOpacity>
        </View>
      )}
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
  mainContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 90, 
  },
  separator: {
    height: 16,
  },
  challengeCard: {
    backgroundColor: HomeColors.challengeCard,
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedChallengeCard: {
    borderColor: HomeColors.accent,
    borderWidth: 2,
  },
  challengeImage: {
    height: 180,
    width: '100%',
  },
  imageStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  gradient: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  challengeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  metricsText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  challengeDetails: {
    padding: 16,
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hostText: {
    fontSize: 13,
    color: HomeColors.text,
    marginLeft: 6,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 13,
    color: HomeColors.text,
    marginLeft: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: HomeColors.text,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: OnboardingColors.accentColor,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 90, 
    zIndex: 999, 
  },
  selectButton: {
    backgroundColor: HomeColors.accent,
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
});