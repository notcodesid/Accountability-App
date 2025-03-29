import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, FlatList, ListRenderItem, StatusBar } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Colors, HomeColors, OnboardingColors } from '../../constants/Colors';
import SafeScreenView from '../../components/SafeScreenView';
import { LinearGradient } from 'expo-linear-gradient';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getChallenges } from '../../services/api';
import { useRouter } from 'expo-router';

// Type definitions for our data structure
interface Challenge {
  id: string;
  title: string;
  image: string;
  duration: string;
  participants: number;
  difficulty: string;
  contributionAmount: string;
  prizeAmount: string;
  type: string;
  metrics?: string;
  details?: string[];
  trackingMetrics?: string[];
}

export default function Home() {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getChallenges();

      if (response.success) {
        // Transform API data to match our UI format
        const transformedChallenges = response.data.map(apiChallenge => ({
          id: apiChallenge.id.toString(),
          title: apiChallenge.title,
          image: apiChallenge.image,
          duration: apiChallenge.duration,
          participants: apiChallenge.participantCount,
          difficulty: apiChallenge.difficulty,
          contributionAmount: `$${(apiChallenge.userStake / 100).toFixed(0)}`,
          prizeAmount: `$${(apiChallenge.totalPrizePool / 100).toFixed(0)}`,
          type: apiChallenge.type.toLowerCase(),
          metrics: apiChallenge.metrics,
          details: [apiChallenge.type, apiChallenge.description?.split('.')[0] || '', apiChallenge.difficulty],
          trackingMetrics: apiChallenge.trackingMetrics
        }));
        setChallenges(transformedChallenges);
      } else {
        setError('Failed to fetch challenges');
      }
    } catch (err) {
      console.error('Error fetching challenges:', err);
      setError('An error occurred while fetching challenges');
    } finally {
      setLoading(false);
    }
  };

  const selectedChallengeData = selectedChallenge
    ? challenges.find(c => c.id === selectedChallenge)
    : null;

  const renderChallengeItem: ListRenderItem<Challenge> = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.challengeCard,
        selectedChallenge === item.id && styles.selectedChallengeCard
      ]}
      onPress={() => setSelectedChallenge(selectedChallenge === item.id ? null : item.id)}
    >
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.challengeImage}
        imageStyle={styles.imageStyle}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.challengeHeader}>
            <Text style={styles.challengeTitle}>{item.title}</Text>
            {item.metrics && (
              <Text style={styles.metricsText}>{item.metrics}</Text>
            )}
          </View>
        </LinearGradient>
      </ImageBackground>

      <View style={styles.challengeDetails}>
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
            <Text style={styles.detailText}>Contribution: {item.contributionAmount}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="trophy" size={14} color={HomeColors.text} />
            <Text style={styles.detailText}>Prize: {item.prizeAmount}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render error state
  if (error) {
    return (
      <SafeScreenView style={styles.container} backgroundColor={HomeColors.background}>
        <StatusBar barStyle="light-content" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={HomeColors.textSecondary} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchChallenges}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeScreenView>
    );
  }

  // Render loading state
  if (loading) {
    return (
      <>
        <SafeScreenView style={styles.container} backgroundColor={HomeColors.background}>
          <StatusBar barStyle="light-content" />
        </SafeScreenView>
        <LoadingSpinner message="Loading challenges..." />
      </>
    );
  }

  return (
    <SafeScreenView style={styles.container} backgroundColor={HomeColors.background} scrollable={false}>
      <StatusBar barStyle="light-content" />

      <View style={styles.selectedHeaderContainer}>
        <LinearGradient
          colors={['rgba(23, 23, 23, 0.9)', 'rgba(10, 10, 10, 0.95)']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.selectedHeaderContent}>
            {selectedChallengeData ? (
              // Selected Challenge Header Content
              <>
                <Text style={styles.selectedHeaderTitle}>{selectedChallengeData.title}</Text>

                {selectedChallengeData.details ? (
                  <Text style={styles.selectedHeaderDetails}>
                    {selectedChallengeData.metrics} • {selectedChallengeData.details.join(' • ')}
                  </Text>
                ) : (
                  <Text style={styles.selectedHeaderDetails}>
                    {selectedChallengeData.metrics} • {selectedChallengeData.difficulty}
                  </Text>
                )}
              </>
            ) : (
              // Default Header Content
              <>
                <Text style={styles.selectedHeaderTitle}>Discover Challenges</Text>
                <Text style={styles.selectedHeaderDetails}>Find your next accountability journey</Text>
              </>
            )}
          </View>
        </LinearGradient>
      </View>

      <FlatList
        data={challenges}
        renderItem={renderChallengeItem}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.listContent,
          selectedChallenge && styles.paddedListContent // Add padding when button is visible
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onRefresh={fetchChallenges}
        refreshing={loading}
      />

      {selectedChallenge && (
        <View style={styles.startButtonContainer}>
          <TouchableOpacity 
            style={styles.startButton} 
            activeOpacity={0.8}
            onPress={() => router.push(`/challenges/${selectedChallenge}`)}
          >
            <Ionicons name="play-circle" size={24} color="#262626" style={styles.playIcon} />
            <Text style={styles.startButtonText}>Start</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Styles for selected challenge header
  selectedHeaderContainer: {
    width: '100%',
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  selectedHeaderContent: {
    flexDirection: 'column',
    position: 'relative',
  },
  selectedHeaderTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  selectedHeaderDetails: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  listContent: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  paddedListContent: {
    paddingBottom: 90, // Make room for the start button
  },
  challengeCard: {
    backgroundColor: HomeColors.challengeCard,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
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
    marginLeft: 6,
  },
  separator: {
    height: 20,
  },
  startButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  startButton: {
    backgroundColor: '#fefffe',
    borderRadius: 30,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  playIcon: {
    marginRight: 8,
  },
  startButtonText: {
    color: '#262626',
    fontSize: 18,
    fontWeight: 'bold',
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
});