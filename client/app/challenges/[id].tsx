import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HomeColors, OnboardingColors } from '../../constants/Colors';
import { useLocalSearchParams, router } from 'expo-router';
import SafeScreenView from '../../components/SafeScreenView';
import { LinearGradient } from 'expo-linear-gradient';
import { getChallengeById } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

// Mock challenge data as fallback
const MOCK_CHALLENGES = {
    '1': {
        id: '1',
        title: '10K Steps Daily',
        type: 'Steps',
        duration: '30 days',
        progress: 0.75,
        participantCount: 156,
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
    // Add more mock challenges if needed
};

export default function ChallengeDetailsScreen() {
    const { id } = useLocalSearchParams();
    const challengeId = Array.isArray(id) ? id[0] : id;
    
    const [challenge, setChallenge] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        fetchChallengeDetails();
    }, [challengeId]);
    
    const fetchChallengeDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Try to fetch from API first
            try {
                const response = await getChallengeById(challengeId);
                
                if (response.success && response.data) {
                    // Format some fields for display
                    const challengeData = {
                        ...response.data,
                        progress: response.data.progress || 0.0,
                        contribution: `$${(response.data.userStake / 100).toFixed(0)}`,
                        prizePool: `$${(response.data.totalPrizePool / 100).toFixed(0)}`,
                        // Format dates to show only the date part
                        startDate: response.data.startDate ? new Date(response.data.startDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        }) : "Coming Soon",
                        endDate: response.data.endDate ? new Date(response.data.endDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        }) : "Coming Soon",
                    };
                    
                    setChallenge(challengeData);
                    setLoading(false);
                    return;
                }
            } catch (apiError) {
                console.log("API error, falling back to mock data:", apiError);
                // Continue to fallback if API fails
            }
            
            // Fallback to mock data if API fails or doesn't have this challenge
            const mockChallenge = MOCK_CHALLENGES[challengeId as keyof typeof MOCK_CHALLENGES] || null;
            
            if (mockChallenge) {
                console.log("Using mock data for challenge:", challengeId);
                
                // Format dates for mock data as well
                if (mockChallenge.startDate) {
                    mockChallenge.startDate = new Date(mockChallenge.startDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                }
                
                if (mockChallenge.endDate) {
                    mockChallenge.endDate = new Date(mockChallenge.endDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                }
                
                setChallenge(mockChallenge);
            } else {
                // If we don't have a mock for this ID, set error
                setError('Challenge not found');
            }
        } catch (err) {
            console.error('Error fetching challenge details:', err);
            setError('An error occurred while fetching challenge details');
        } finally {
            setLoading(false);
        }
    };
    
    // Render error state
    if (error) {
        return (
            <SafeScreenView style={styles.container} backgroundColor={HomeColors.background}>
                <StatusBar barStyle="light-content" />
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={60} color={HomeColors.textSecondary} />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Return to Challenges</Text>
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
                <LoadingSpinner message="Loading challenge..." />
            </>
        );
    }
    
    // Render not found state
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
                                    <View key={index} style={styles.metricBadge}>
                                        <Text style={styles.metricText}>{metric}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
            
            {challenge.status !== 'completed' && (
                <View style={styles.actionContainer}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="play-circle" size={24} color="#fff" style={styles.actionIcon} />
                        <Text style={styles.actionButtonText}>Start</Text>
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