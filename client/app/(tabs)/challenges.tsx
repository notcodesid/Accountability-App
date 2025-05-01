import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, HomeColors, OnboardingColors } from '../../constants/Colors';
import { router } from 'expo-router';
import SafeScreenView from '../../components/SafeScreenView';
import { LinearGradient } from 'expo-linear-gradient';
import LoadingSpinner from '../../components/LoadingSpinner';

// Mock challenge data
interface Challenge {
    id: string;
    title: string;
    type: string;
    difficulty: string;
    image: string;
    description: string;
    duration: number;
    reward: number;
}

interface UserChallenge {
    id: string;
    challengeId: string;
    userId: string;
    status: string;
    progress: number;
    startDate: string;
    endDate: string | null;
    challenge: Challenge;
}

// Mock active challenges
const MOCK_ACTIVE_CHALLENGES: UserChallenge[] = [
    {
        id: 'uc1',
        challengeId: 'c1',
        userId: 'u1',
        status: 'ACTIVE',
        progress: 0.65,
        startDate: '2025-04-15T00:00:00Z',
        endDate: null,
        challenge: {
            id: 'c1',
            title: '30 Days of Meditation',
            type: 'Wellness',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070',
            description: 'Meditate for at least 10 minutes every day for 30 days.',
            duration: 30,
            reward: 50
        }
    },
    {
        id: 'uc2',
        challengeId: 'c2',
        userId: 'u1',
        status: 'ACTIVE',
        progress: 0.33,
        startDate: '2025-04-20T00:00:00Z',
        endDate: null,
        challenge: {
            id: 'c2',
            title: 'Code for 100 Hours',
            type: 'Productivity',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070',
            description: 'Complete 100 hours of coding in 30 days.',
            duration: 30,
            reward: 75
        }
    },
    {
        id: 'uc3',
        challengeId: 'c3',
        userId: 'u1',
        status: 'ACTIVE',
        progress: 0.85,
        startDate: '2025-04-10T00:00:00Z',
        endDate: null,
        challenge: {
            id: 'c3',
            title: '10K Steps Daily',
            type: 'Fitness',
            difficulty: 'Easy',
            image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2070',
            description: 'Walk at least 10,000 steps every day for 21 days.',
            duration: 21,
            reward: 40
        }
    }
];

// Mock completed challenges
const MOCK_COMPLETED_CHALLENGES: UserChallenge[] = [
    {
        id: 'uc4',
        challengeId: 'c4',
        userId: 'u1',
        status: 'COMPLETED',
        progress: 1.0,
        startDate: '2025-03-01T00:00:00Z',
        endDate: '2025-03-21T00:00:00Z',
        challenge: {
            id: 'c4',
            title: 'Learn a New Language',
            type: 'Education',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071',
            description: 'Study a new language for at least 30 minutes every day for 21 days.',
            duration: 21,
            reward: 45
        }
    },
    {
        id: 'uc5',
        challengeId: 'c5',
        userId: 'u1',
        status: 'COMPLETED',
        progress: 1.0,
        startDate: '2025-02-15T00:00:00Z',
        endDate: '2025-03-15T00:00:00Z',
        challenge: {
            id: 'c5',
            title: 'No Social Media',
            type: 'Digital Wellness',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1974',
            description: 'Avoid all social media platforms for 30 days straight.',
            duration: 30,
            reward: 80
        }
    },
    {
        id: 'uc6',
        challengeId: 'c6',
        userId: 'u1',
        status: 'COMPLETED',
        progress: 1.0,
        startDate: '2025-01-10T00:00:00Z',
        endDate: '2025-02-10T00:00:00Z',
        challenge: {
            id: 'c6',
            title: 'Daily Journaling',
            type: 'Mindfulness',
            difficulty: 'Easy',
            image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2070',
            description: 'Write in your journal for at least 10 minutes every day for 30 days.',
            duration: 30,
            reward: 35
        }
    },
    {
        id: 'uc7',
        challengeId: 'c7',
        userId: 'u1',
        status: 'COMPLETED',
        progress: 1.0,
        startDate: '2024-12-01T00:00:00Z',
        endDate: '2024-12-31T00:00:00Z',
        challenge: {
            id: 'c7',
            title: 'Cold Shower Challenge',
            type: 'Wellness',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1932',
            description: 'Take a cold shower every morning for 30 days.',
            duration: 30,
            reward: 60
        }
    }
];

export default function ChallengesScreen() {
    const [activeTab, setActiveTab] = useState('active');
    const [activeChallenges, setActiveChallenges] = useState<UserChallenge[]>([]);
    const [completedChallenges, setCompletedChallenges] = useState<UserChallenge[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Get dynamic header text based on selected tab
    const getHeaderText = () => {
        switch(activeTab) {
            case 'active':
                return { title: 'My Challenges', subtitle: 'Track your ongoing challenges' };
            case 'completed':
                return { title: 'Completed Challenges', subtitle: 'View your past victories' };
            default:
                return { title: 'My Challenges', subtitle: 'Track your ongoing challenges' };
        }
    };
    
    const navigateToHome = () => {
        router.push('/(tabs)');
    };

    useEffect(() => {
        fetchUserChallenges();
    }, []);

    const fetchUserChallenges = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Simulate API call with a delay
            setTimeout(() => {
                setActiveChallenges(MOCK_ACTIVE_CHALLENGES);
                setCompletedChallenges(MOCK_COMPLETED_CHALLENGES);
                setLoading(false);
            }, 1000);
            
        } catch (err) {
            console.error('Error fetching user challenges:', err);
            setError('An error occurred while fetching challenges');
            setLoading(false);
        }
    };

    const renderChallenges = () => {
        const challenges = activeTab === 'active' ? activeChallenges : completedChallenges;
        
        if (loading) {
            return (
                <View style={styles.loadingContainer}>
                    <LoadingSpinner message="Loading challenges..." />
                </View>
            );
        }
        
        if (error) {
            return (
                <View style={styles.emptyStateContainer}>
                    <View style={styles.emptyStateIcon}>
                        <Ionicons name="alert-circle-outline" size={80} color={HomeColors.textSecondary} />
                    </View>
                    <Text style={styles.emptyStateTitle}>Error Loading Challenges</Text>
                    <Text style={styles.emptyStateDescription}>{error}</Text>
                    <TouchableOpacity 
                        style={styles.joinNowButton}
                        onPress={fetchUserChallenges}
                    >
                        <LinearGradient
                            colors={[OnboardingColors.accentColor, OnboardingColors.accentSecondary]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientButton}
                        >
                            <Text style={styles.joinNowButtonText}>Try Again</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            );
        }

        if (challenges.length === 0) {
            return (
                <View style={styles.emptyStateContainer}>
                    <View style={styles.emptyStateIcon}>
                        <Ionicons name="trophy-outline" size={80} color={HomeColors.textSecondary} />
                    </View>
                    
                    <Text style={styles.emptyStateTitle}>
                        No {activeTab === 'active' ? 'Active' : 'Completed'} Challenges
                    </Text>
                    
                    <Text style={styles.emptyStateDescription}>
                        {activeTab === 'active' 
                            ? "You haven't joined any challenges yet. Explore and join challenges to stay accountable." 
                            : "You don't have any completed challenges yet. Complete your active challenges to see them here."}
                    </Text>
                    
                    {activeTab === 'active' && (
                        <TouchableOpacity 
                            style={styles.joinNowButton}
                            onPress={navigateToHome}
                        >
                            <LinearGradient
                                colors={[OnboardingColors.accentColor, OnboardingColors.accentSecondary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientButton}
                            >
                                <Text style={styles.joinNowButtonText}>Explore Challenges</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </View>
            );
        }

        return (
            <ScrollView style={styles.challengesList}>
                {challenges.map((item) => (
                    <TouchableOpacity 
                        key={item.id} 
                        style={styles.challengeItem}
                        onPress={() => router.push(`/challenges/${item.challengeId}`)}
                    >
                        <View style={styles.challengeImageContainer}>
                            <Image 
                                source={{ uri: item.challenge.image }} 
                                style={styles.challengeImage}
                            />
                            {activeTab === 'completed' && (
                                <View style={styles.completedBadge}>
                                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                                </View>
                            )}
                        </View>
                        <View style={styles.challengeContent}>
                            <Text style={styles.challengeTitle}>
                                {item.challenge.title}
                            </Text>
                            <Text style={styles.challengeType}>
                                {item.challenge.type} • {item.challenge.difficulty}
                            </Text>
                            <View style={styles.progressContainer}>
                                <View 
                                    style={[
                                        styles.progressBar, 
                                        { width: `${item.progress * 100}%` },
                                        activeTab === 'completed' && styles.completedProgressBar
                                    ]}
                                />
                            </View>
                            <View style={styles.challengeFooter}>
                                <Text style={styles.progressText}>
                                    {Math.round(item.progress * 100)}% complete
                                </Text>
                                <View style={styles.rewardContainer}>
                                    <Ionicons name="wallet-outline" size={14} color="#FFD700" />
                                    <Text style={styles.rewardText}>{item.challenge.reward} SOL</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.safeAreaTop} />
            
            <View style={styles.selectedHeaderContainer}>
                <LinearGradient
                    colors={['rgba(23, 23, 23, 0.9)', 'rgba(10, 10, 10, 0.95)']}
                    style={styles.headerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                >
                    <View style={styles.selectedHeaderContent}>
                        <Text style={styles.selectedHeaderTitle}>{getHeaderText().title}</Text>
                        <Text style={styles.selectedHeaderDetails}>{getHeaderText().subtitle}</Text>
                    </View>
                </LinearGradient>
            </View>
            
            <View style={styles.tabs}>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'active' && styles.activeTab]} 
                    onPress={() => setActiveTab('active')}
                >
                    <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>Active</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'completed' && styles.activeTab]} 
                    onPress={() => setActiveTab('completed')}
                >
                    <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>Completed</Text>
                </TouchableOpacity>
            </View>
            
            {renderChallenges()}
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
    selectedHeaderContainer: {
        width: '100%',
    },
    headerGradient: {
        paddingVertical: 15,
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
    tabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: HomeColors.challengeCard,
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
        fontWeight: '500',
        color: HomeColors.textSecondary,
    },
    activeTabText: {
        color: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: HomeColors.challengeCard,
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: HomeColors.challengeCard,
    },
    emptyStateIcon: {
        marginBottom: 20,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    emptyStateDescription: {
        fontSize: 16,
        color: HomeColors.textSecondary,
        textAlign: 'center',
        marginBottom: 30,
    },
    joinNowButton: {
        width: '80%',
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
    },
    gradientButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    joinNowButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    challengesList: {
        flex: 1,
        backgroundColor: HomeColors.challengeCard,
    },
    challengeItem: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    challengeImageContainer: {
        width: 80,
        height: 80,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    challengeImage: {
        width: '100%',
        height: '100%',
    },
    completedBadge: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 12,
        padding: 2,
    },
    challengeContent: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'space-between',
    },
    challengeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    challengeType: {
        fontSize: 14,
        color: HomeColors.textSecondary,
        marginBottom: 10,
    },
    progressContainer: {
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        marginBottom: 8,
    },
    progressBar: {
        height: '100%',
        backgroundColor: OnboardingColors.accentColor,
        borderRadius: 3,
    },
    completedProgressBar: {
        backgroundColor: '#4CAF50',
    },
    challengeFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressText: {
        fontSize: 12,
        color: HomeColors.textSecondary,
    },
    rewardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rewardText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFD700',
        marginLeft: 4,
    },
});