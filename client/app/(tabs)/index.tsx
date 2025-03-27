import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, FlatList, ListRenderItem, StatusBar } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Colors, HomeColors } from '../../constants/Colors';
import SafeScreenView from '../../components/SafeScreenView';
import { LinearGradient } from 'expo-linear-gradient';

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
  type: 'walk' | 'run' | 'fitness';
  metrics?: string; // e.g., "3x • 40s" as shown in the reference image
  details?: string[]; // Additional challenge details like "Upper Body • Build strength • Beginner"
  trackingMetrics?: string[]; // The metrics that will be tracked for this challenge
}

// Sample data for challenges
const challenges: Challenge[] = [
  {
    id: '1',
    title: '10K Steps Daily',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1000',
    duration: '30 days',
    participants: 156,
    difficulty: 'Moderate',
    contributionAmount: '$50',
    prizeAmount: '$7,800',
    type: 'walk',
    metrics: '10,000 steps daily',
    details: ['Step Tracking', 'Distance Covered', 'Calories Burned'],
    trackingMetrics: ['Steps Count', 'Distance Covered', 'Calories Burned']
  },
  {
    id: '2',
    title: '5K Pace Challenge',
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=1000',
    duration: '21 days',
    participants: 89,
    difficulty: 'Advanced',
    contributionAmount: '$75',
    prizeAmount: '$6,675',
    type: 'run',
    metrics: '5 km • 3x week',
    details: ['Run Tracking', 'Pace Improvement', 'GPS Tracking'],
    trackingMetrics: ['Distance Covered', 'Speed & Pace', 'Workout Tracking']
  },
  {
    id: '3',
    title: 'Active Minutes',
    image: 'https://images.unsplash.com/photo-1470299067034-07c696e9ef07?auto=format&fit=crop&w=1000',
    duration: '14 days',
    participants: 124,
    difficulty: 'Beginner',
    contributionAmount: '$25',
    prizeAmount: '$3,100',
    type: 'fitness',
    metrics: '60 min • daily',
    details: ['Activity Tracking', 'Any Movement', 'Beginner Friendly'],
    trackingMetrics: ['Move Minutes', 'Calories Burned']
  },
  {
    id: '4',
    title: 'Calorie Burner',
    image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1000',
    duration: '28 days',
    participants: 67,
    difficulty: 'Moderate',
    contributionAmount: '$60',
    prizeAmount: '$4,020',
    type: 'fitness',
    metrics: '400 cal • daily',
    details: ['Calorie Tracking', 'Any Activity', 'Multiple Workouts'],
    trackingMetrics: ['Calories Burned', 'Workout Tracking', 'Move Minutes']
  }
];

export default function Home() {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  
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
      />
      
      {selectedChallenge && (
        <View style={styles.startButtonContainer}>
          <TouchableOpacity style={styles.startButton} activeOpacity={0.8}>
            <Ionicons name="play-circle" size={24} color="#262626" style={styles.playIcon} />
            <Text style={styles.startButtonText}>Start Workout</Text>
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
  }
});