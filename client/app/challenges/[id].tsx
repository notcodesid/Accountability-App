import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {  HomeColors, OnboardingColors } from '../../constants/Colors';
import { useLocalSearchParams, router } from 'expo-router';
import SafeScreenView from '../../components/SafeScreenView';
import { LinearGradient } from 'expo-linear-gradient';

// Mock challenge data - this would be fetched from an API in a real app
const CHALLENGES = {
    '1': {
        id: '1',
        title: '10K Steps Daily',
        type: 'Steps',
        duration: '30 days',
        progress: 0.75,
        participants: 156,
        contribution: '$50',
        prizePool: '$7,800',
        status: 'active',
        description: 'Walk 10,000 steps every day for 30 days to complete this challenge. Track your progress with any fitness app or device.',
        rules: [
            'Complete 10,000 steps daily',
            'Must sync data with fitness tracker',
            'Rest days are not counted',
            'Missed days will reset progress'
        ],
        image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1000',
        startDate: '2024-03-01',
        endDate: '2024-03-30',
        creatorName: 'Fitness Community',
        trackingMetrics: ['Steps Count', 'Distance Covered', 'Calories Burned']
    },
    '2': {
        id: '2',
        title: '5K Pace Challenge',
        type: 'Running',
        duration: '21 days',
        progress: 0.45,
        participants: 89,
        contribution: '$75',
        prizePool: '$6,675',
        status: 'active',
        description: 'Improve your 5K running time over 21 days. Run at least 3 times per week and track your progress.',
        rules: [
            'Complete at least 3 runs per week',
            'Each run must be at least 5K in distance',
            'Track your time for each run',
            'Final ranking based on improvement percentage'
        ],
        image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=1000',
        startDate: '2024-03-10',
        endDate: '2024-03-31',
        creatorName: 'Running Club',
        trackingMetrics: ['Distance Covered', 'Speed & Pace', 'Workout Tracking']
    },
    '3': {
        id: '3',
        title: 'Active Minutes',
        type: 'Activity',
        duration: '14 days',
        progress: 0.3,
        participants: 124,
        contribution: '$25',
        prizePool: '$3,100',
        status: 'active',
        description: 'Accumulate at least 60 active minutes daily for 14 days. Any physical activity counts!',
        rules: [
            'Record at least 60 active minutes daily',
            'Activities must be moderate to high intensity',
            'Multiple sessions can be combined',
            'Must verify with heart rate data'
        ],
        image: 'https://images.unsplash.com/photo-1470299067034-07c696e9ef07?auto=format&fit=crop&w=1000',
        startDate: '2024-03-15',
        endDate: '2024-03-29',
        creatorName: 'Health Collective',
        trackingMetrics: ['Move Minutes', 'Calories Burned']
    },
    '4': {
        id: '4',
        title: 'Morning Meditation',
        type: 'Wellness',
        duration: '60 days',
        progress: 1.0,
        participants: 208,
        contribution: '$30',
        prizePool: '$6,240',
        status: 'completed',
        description: 'Meditate for at least 10 minutes every morning for 60 days to establish a mindfulness habit.',
        rules: [
            'Meditate for 10+ minutes daily',
            'Must be completed before 10 AM',
            'Use approved meditation apps for tracking',
            'Submit screenshot proof daily'
        ],
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000',
        startDate: '2024-01-01',
        endDate: '2024-03-01',
        creatorName: 'Wellness Circle',
        trackingMetrics: ['Meditation Minutes', 'Consistency']
    },
    '5': {
        id: '5',
        title: 'Water Intake Challenge',
        type: 'Health',
        duration: '14 days',
        progress: 1.0,
        participants: 143,
        contribution: '$20',
        prizePool: '$2,860',
        status: 'completed',
        description: 'Drink at least 2 liters of water daily for 14 days. Track your hydration to build a healthy habit.',
        rules: [
            'Consume 2L of water daily minimum',
            'Log intake in the app',
            'Only water counts (no tea, coffee, etc.)',
            'Submit photo evidence daily'
        ],
        image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1000',
        startDate: '2024-02-01',
        endDate: '2024-02-15',
        creatorName: 'Health Habits',
        trackingMetrics: ['Water Volume', 'Consistency']
    },
    '6': {
        id: '6',
        title: 'Book Reading Marathon',
        type: 'Education',
        duration: '30 days',
        progress: 1.0,
        participants: 95,
        contribution: '$40',
        prizePool: '$3,800',
        status: 'completed',
        description: 'Read for at least 30 minutes every day for 30 days. Expand your knowledge and build a reading habit.',
        rules: [
            'Read for 30+ minutes daily',
            'Log your reading time and pages',
            'Physical books, e-books, and audiobooks acceptable',
            'Submit a short summary weekly'
        ],
        image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1000',
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        creatorName: 'Book Lovers Club',
        trackingMetrics: ['Reading Time', 'Pages Read']
    },
    '7': {
        id: '7',
        title: 'Plank Challenge',
        type: 'Fitness',
        duration: '30 days',
        progress: 0.15,
        participants: 67,
        contribution: '$35',
        prizePool: '$2,345',
        status: 'active',
        description: 'Build your core strength with a daily plank for 30 days. Start with 30 seconds and increase gradually.',
        rules: [
            'Complete daily plank exercise',
            'Duration increases by 5 seconds each day',
            'Submit video proof daily',
            'Proper form required for validation'
        ],
        image: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?auto=format&fit=crop&w=1000',
        startDate: '2024-03-20',
        endDate: '2024-04-19',
        creatorName: 'Core Fitness',
        trackingMetrics: ['Plank Time', 'Form Quality']
    }
};

export default function ChallengeDetailsScreen() {
    const { id } = useLocalSearchParams();
    const challengeId = Array.isArray(id) ? id[0] : id;
    
    // In a real app, you would fetch challenge details from an API
    const challenge = CHALLENGES[challengeId as keyof typeof CHALLENGES];
    
    if (!challenge) {
        return (
            <SafeScreenView style={styles.container} backgroundColor={HomeColors.background}>
                <StatusBar barStyle="light-content" />
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={60} color={HomeColors.textSecondary} />
                    <Text style={styles.errorText}>Challenge not found</Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Return to Challenges</Text>
                    </TouchableOpacity>
                </View>
            </SafeScreenView>
        );
    }

    return (
        <SafeScreenView style={styles.container} backgroundColor={HomeColors.background} scrollable={false}>
            <StatusBar barStyle="light-content" />
            
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <Image 
                        source={{ uri: challenge.image }} 
                        style={styles.coverImage}
                    />
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <LinearGradient
                        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
                        style={styles.imageGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                    >
                        <View style={styles.badgeContainer}>
                            <View style={[
                                styles.typeBadge,
                                challenge.status === 'completed' ? styles.completedBadge : {}
                            ]}>
                                <Text style={styles.typeBadgeText}>{challenge.type}</Text>
                            </View>
                            
                            {challenge.status === 'completed' && (
                                <View style={styles.statusBadge}>
                                    <Ionicons name="checkmark-circle" size={16} color="#fff" />
                                    <Text style={styles.statusText}>Completed</Text>
                                </View>
                            )}
                        </View>
                    </LinearGradient>
                </View>
                
                <View style={styles.contentContainer}>
                    <View style={styles.headerSection}>
                        <Text style={styles.title}>{challenge.title}</Text>
                        <View style={styles.metaRow}>
                            <View style={styles.metaItem}>
                                <Ionicons name="calendar" size={16} color={HomeColors.textSecondary} />
                                <Text style={styles.metaText}>{challenge.duration}</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Ionicons name="people" size={16} color={HomeColors.textSecondary} />
                                <Text style={styles.metaText}>{challenge.participants} participants</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.progressSection}>
                        <View style={styles.progressHeader}>
                            <Text style={styles.sectionTitle}>Your Progress</Text>
                            <Text style={styles.progressPercentage}>{Math.round(challenge.progress * 100)}%</Text>
                        </View>
                        <View style={styles.progressContainer}>
                            <View 
                                style={[
                                    styles.progressBar, 
                                    { width: `${challenge.progress * 100}%` },
                                    challenge.status === 'completed' ? styles.completedProgressBar : {}
                                ]} 
                            />
                        </View>
                    </View>
                    
                    <View style={styles.detailsSection}>
                        <Text style={styles.sectionTitle}>Challenge Details</Text>
                        <Text style={styles.description}>{challenge.description}</Text>
                        
                        <View style={styles.datesContainer}>
                            <View style={styles.dateItem}>
                                <Text style={styles.dateLabel}>Start Date</Text>
                                <Text style={styles.dateValue}>{challenge.startDate}</Text>
                            </View>
                            <View style={styles.dateItem}>
                                <Text style={styles.dateLabel}>End Date</Text>
                                <Text style={styles.dateValue}>{challenge.endDate}</Text>
                            </View>
                        </View>
                    </View>
                    
                    <View style={styles.rulesSection}>
                        <Text style={styles.sectionTitle}>Challenge Rules</Text>
                        {challenge.rules.map((rule, index) => (
                            <View key={index} style={styles.ruleItem}>
                                <Ionicons name="checkmark-circle" size={20} color={OnboardingColors.accentColor} />
                                <Text style={styles.ruleText}>{rule}</Text>
                            </View>
                        ))}
                    </View>
                    
                    <View style={styles.statsSection}>
                        <Text style={styles.sectionTitle}>Challenge Stats</Text>
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{challenge.contribution}</Text>
                                <Text style={styles.statLabel}>Your Stake</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{challenge.prizePool}</Text>
                                <Text style={styles.statLabel}>Prize Pool</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{challenge.creatorName}</Text>
                                <Text style={styles.statLabel}>Creator</Text>
                            </View>
                        </View>
                    </View>
                    
                    <View style={styles.trackingSection}>
                        <Text style={styles.sectionTitle}>Tracking Metrics</Text>
                        <View style={styles.metricsContainer}>
                            {challenge.trackingMetrics.map((metric, index) => (
                                <View key={index} style={styles.metricBadge}>
                                    <Text style={styles.metricText}>{metric}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
            
            {challenge.status === 'active' && (
                <View style={styles.actionContainer}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="play-circle" size={24} color="#fff" style={styles.actionIcon} />
                        <Text style={styles.actionButtonText}>Log Today's Activity</Text>
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
    },
    scrollView: {
        flex: 1,
    },
    imageContainer: {
        height: 300,
        position: 'relative',
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        color: OnboardingColors.accentColor,
        fontSize: 16,
        fontWeight: '600',
    },
    imageGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        justifyContent: 'flex-end',
        padding: 15,
    },
    badgeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    typeBadge: {
        backgroundColor: OnboardingColors.accentColor,
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    completedBadge: {
        backgroundColor: '#4CAF50',
    },
    typeBadgeText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
    },
    statusBadge: {
        backgroundColor: '#4CAF50',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    contentContainer: {
        padding: 20,
    },
    headerSection: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: HomeColors.text,
        marginBottom: 10,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    metaText: {
        fontSize: 14,
        color: HomeColors.textSecondary,
        marginLeft: 5,
    },
    progressSection: {
        marginBottom: 25,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    progressPercentage: {
        fontSize: 16,
        fontWeight: 'bold',
        color: OnboardingColors.accentColor,
    },
    progressContainer: {
        height: 8,
        backgroundColor: '#333333',
        borderRadius: 4,
    },
    progressBar: {
        height: '100%',
        backgroundColor: OnboardingColors.accentColor,
        borderRadius: 4,
    },
    completedProgressBar: {
        backgroundColor: '#4CAF50',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: HomeColors.text,
        marginBottom: 10,
    },
    detailsSection: {
        marginBottom: 25,
    },
    description: {
        fontSize: 14,
        color: HomeColors.textSecondary,
        lineHeight: 22,
        marginBottom: 15,
    },
    datesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: HomeColors.challengeCard,
        borderRadius: 10,
        padding: 15,
    },
    dateItem: {
        flex: 1,
    },
    dateLabel: {
        fontSize: 12,
        color: HomeColors.textSecondary,
        marginBottom: 5,
    },
    dateValue: {
        fontSize: 14,
        color: HomeColors.text,
        fontWeight: '600',
    },
    rulesSection: {
        marginBottom: 25,
    },
    ruleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    ruleText: {
        fontSize: 14,
        color: HomeColors.textSecondary,
        marginLeft: 10,
        flex: 1,
    },
    statsSection: {
        marginBottom: 25,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: HomeColors.challengeCard,
        borderRadius: 10,
        padding: 15,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: HomeColors.text,
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 12,
        color: HomeColors.textSecondary,
    },
    trackingSection: {
        marginBottom: 80,
    },
    metricsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    metricBadge: {
        backgroundColor: HomeColors.challengeCard,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 15,
        marginRight: 10,
        marginBottom: 10,
    },
    metricText: {
        fontSize: 12,
        color: HomeColors.text,
    },
    actionContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 15,
        backgroundColor: HomeColors.background,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
    },
    actionButton: {
        backgroundColor: OnboardingColors.accentColor,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 10,
    },
    actionIcon: {
        marginRight: 8,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 