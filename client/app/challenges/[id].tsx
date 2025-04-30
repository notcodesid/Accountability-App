import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HomeColors, OnboardingColors } from '../../constants/Colors';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import LoadingSpinner from '../../components/LoadingSpinner';

// Mock challenge data
const MOCK_CHALLENGES = {
    '1': {
        id: '1',
        title: 'Nike Move Marathon',
        type: 'Fitness',
        hostType: 'ORG',
        sponsor: 'Nike',
        duration: '30 days',
        difficulty: "MODERATE",
        userStake: 1.5,
        totalPrizePool: 100,
        participants: 100,
        participantCount: 100,
        metrics: "Steps",
        trackingMetrics: ["steps"],
        image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77',
        description: 'Complete 10,000 steps every day for 30 days to complete this challenge. Track your progress with any fitness app or device.',
        rules: [
            'Complete 10,000 steps daily',
            'Must sync data with fitness tracker',
            'Rest days are not counted',
            'Missed days will reset progress'
        ],
        startDate: '2024-05-01',
        endDate: '2024-05-30',
        creatorName: 'Nike',
        contribution: '$1.5',
        prizePool: '$100',
    },
    '2': {
        id: '2',
        title: 'Headspace Mindfulness Sprint',
        type: 'Mental Health',
        hostType: 'ORG',
        sponsor: 'Headspace',
        duration: '21 days',
        difficulty: "EASY",
        userStake: 1,
        totalPrizePool: 200,
        participants: 300,
        participantCount: 300,
        metrics: "Minutes",
        trackingMetrics: ["meditation_minutes"],
        image: 'https://images.unsplash.com/photo-1606639386701-f3826670507c',
        description: 'Meditate for at least 10 minutes daily for 21 days. Build a consistent mindfulness practice with the support of a community.',
        rules: [
            'Complete 10 minutes of meditation daily',
            'Log your sessions in the app',
            'Join at least 3 community sessions',
            'Share one reflection per week'
        ],
        startDate: '2024-05-05',
        endDate: '2024-05-26',
        creatorName: 'Headspace',
        contribution: '$1',
        prizePool: '$200',
    },
    '3': {
        id: '3',
        title: 'Code Daily Crew Challenge',
        type: 'Programming',
        hostType: 'FRIEND',
        creator: 'Sarah_Dev',
        duration: '45 days',
        difficulty: "HARD",
        userStake: 2,
        totalPrizePool: 21.6,
        participants: 12,
        participantCount: 12,
        metrics: "Code Commits",
        trackingMetrics: ["github_commits"],
        image: 'https://images.unsplash.com/photo-1619410283995-43d9134e7656',
        description: 'Make at least one meaningful commit to your GitHub repository every day for 45 days. Build coding consistency and ship more projects.',
        rules: [
            'One meaningful commit per day',
            'Must be to a public repository',
            'Commits must include actual code changes',
            'Documentation-only commits don\'t count'
        ],
        startDate: '2024-05-10',
        endDate: '2024-06-24',
        creatorName: 'Sarah_Dev',
        contribution: '$2',
        prizePool: '$21.6',
    },
    '4': {
        id: '4',
        title: 'Vegan30 Squad',
        type: 'Lifestyle',
        hostType: 'FRIEND',
        creator: 'EcoMike',
        duration: '30 days',
        difficulty: "MODERATE",
        userStake: 1.2,
        totalPrizePool: 10.8,
        participants: 10,
        participantCount: 10,
        metrics: "Check-ins",
        trackingMetrics: ["meal_photos", "community_votes"],
        image: 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7',
        description: 'Follow a plant-based diet for 30 days. Post daily meal photos and get community support to make the transition easier.',
        rules: [
            'Eat only plant-based foods',
            'Post at least one meal photo daily',
            'Participate in weekly check-ins',
            'Vote on at least 5 other meals per week'
        ],
        startDate: '2024-05-15',
        endDate: '2024-06-14',
        creatorName: 'EcoMike',
        contribution: '$1.2',
        prizePool: '$10.8',
    }
};

export default function ChallengeDetailsScreen() {
    const { id } = useLocalSearchParams();
    const challengeId = Array.isArray(id) ? id[0] : id;
    
    const [challenge, setChallenge] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [joined, setJoined] = useState(false);
    
    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            const mockChallenge = MOCK_CHALLENGES[challengeId as keyof typeof MOCK_CHALLENGES];
            
            if (mockChallenge) {
                setChallenge(mockChallenge);
            } else {
                setError('Challenge not found');
            }
            
            setLoading(false);
        }, 500);
        
        return () => clearTimeout(timer);
    }, [challengeId]);
    
    const handleJoinChallenge = () => {
        Alert.alert(
            'Join Challenge',
            `Are you sure you want to join this challenge? ${challenge.contribution} will be deducted from your wallet.`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Join',
                    onPress: () => {
                        // Simulate joining process
                        setTimeout(() => {
                            Alert.alert(
                                'Success!',
                                'You have successfully joined the challenge.',
                                [
                                    {
                                        text: 'OK',
                                        onPress: () => {
                                            // Go back to the challenges list
                                            router.back();
                                        }
                                    }
                                ]
                            );
                            setJoined(true);
                        }, 500);
                    },
                },
            ]
        );
    };
    
    // Render error state
    if (error) {
        return (
            <View style={[styles.container, { backgroundColor: HomeColors.background }]}>
                <StatusBar barStyle="light-content" />
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={60} color={HomeColors.textSecondary} />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Return to Challenges</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    
    // Render loading state
    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: HomeColors.background }]}>
                <StatusBar barStyle="light-content" />
                <LoadingSpinner message="Loading challenge..." />
            </View>
        );
    }
    
    // Render not found state
    if (!challenge) {
        return (
            <View style={[styles.container, { backgroundColor: HomeColors.background }]}>
                <StatusBar barStyle="light-content" />
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={60} color={HomeColors.textSecondary} />
                    <Text style={styles.errorText}>Challenge not found</Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Return to Challenges</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: HomeColors.background }]}>
            <StatusBar barStyle="light-content" />
            <View style={styles.safeAreaTop} />
            
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
                            <View style={styles.typeBadge}>
                                <Text style={styles.typeBadgeText}>{challenge.type}</Text>
                            </View>
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
                                <Text style={styles.metaText}>{challenge.participantCount} participants</Text>
                            </View>
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
                    
                    {challenge.rules && challenge.rules.length > 0 && (
                        <View style={styles.rulesSection}>
                            <Text style={styles.sectionTitle}>Challenge Rules</Text>
                            {challenge.rules.map((rule: string, index: number) => (
                                <View key={index} style={styles.ruleItem}>
                                    <Ionicons name="checkmark-circle" size={20} color={OnboardingColors.accentColor} />
                                    <Text style={styles.ruleText}>{rule}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                    
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
                                <Text style={styles.statValue}>{challenge.creatorName || "Community"}</Text>
                                <Text style={styles.statLabel}>Creator</Text>
                            </View>
                        </View>
                    </View>
                    
                    {challenge.trackingMetrics && challenge.trackingMetrics.length > 0 && (
                        <View style={styles.trackingSection}>
                            <Text style={styles.sectionTitle}>Tracking Metrics</Text>
                            <View style={styles.metricsContainer}>
                                {challenge.trackingMetrics.map((metric: string, index: number) => (
                                    <View key={index} style={styles.metricItem}>
                                        <Ionicons 
                                            name={
                                                metric.includes('steps') ? 'walk' :
                                                metric.includes('meditation') ? 'heart' :
                                                metric.includes('github') ? 'code-slash' :
                                                'checkmark-circle'
                                            } 
                                            size={18} 
                                            color={OnboardingColors.accentColor} 
                                        />
                                        <Text style={styles.metricText}>
                                            {metric.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
            
            <View style={styles.actionContainer}>
                {!joined ? (
                    <TouchableOpacity 
                        style={styles.joinButton}
                        onPress={handleJoinChallenge}
                    >
                        <Text style={styles.joinButtonText}>Join Challenge</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity 
                        style={[styles.joinButton, styles.joinedButton]}
                        disabled={true}
                    >
                        <Text style={styles.joinButtonText}>Already Joined</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeAreaTop: {
        height: 50,
        backgroundColor: HomeColors.background,
    },
    scrollView: {
        flex: 1,
    },
    imageContainer: {
        height: 250,
        position: 'relative',
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 16,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        color: '#fff',
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
        padding: 16,
    },
    badgeContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    typeBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    typeBadgeText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    completedBadge: {
        backgroundColor: OnboardingColors.accentColor,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(46, 204, 113, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginLeft: 8,
    },
    statusText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    contentContainer: {
        padding: 16,
    },
    headerSection: {
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: HomeColors.text,
        marginBottom: 8,
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
        marginBottom: 8,
    },
    metaText: {
        fontSize: 14,
        color: HomeColors.textSecondary,
        marginLeft: 6,
    },
    detailsSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: HomeColors.text,
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
        color: HomeColors.textSecondary,
        marginBottom: 16,
    },
    datesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: HomeColors.challengeCard,
        borderRadius: 12,
        padding: 16,
    },
    dateItem: {
        flex: 1,
    },
    dateLabel: {
        fontSize: 14,
        color: HomeColors.textSecondary,
        marginBottom: 4,
    },
    dateValue: {
        fontSize: 15,
        fontWeight: '600',
        color: HomeColors.text,
    },
    rulesSection: {
        marginBottom: 24,
    },
    ruleItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    ruleText: {
        fontSize: 15,
        lineHeight: 22,
        color: HomeColors.textSecondary,
        marginLeft: 10,
        flex: 1,
    },
    statsSection: {
        marginBottom: 24,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: HomeColors.challengeCard,
        borderRadius: 12,
        padding: 16,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
        color: HomeColors.text,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
        color: HomeColors.textSecondary,
    },
    trackingSection: {
        marginBottom: 24,
    },
    metricsContainer: {
        backgroundColor: HomeColors.challengeCard,
        borderRadius: 12,
        padding: 16,
    },
    metricItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    metricText: {
        fontSize: 15,
        color: HomeColors.textSecondary,
        marginLeft: 10,
    },
    actionContainer: {
        padding: 16,
        paddingBottom: 32,
    },
    joinButton: {
        backgroundColor: OnboardingColors.accentColor,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    joinedButton: {
        backgroundColor: HomeColors.textSecondary,
    },
    joinButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
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
});