import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, HomeColors, OnboardingColors } from '../../constants/Colors';
import { router } from 'expo-router';
import SafeScreenView from '../../components/SafeScreenView';
import { LinearGradient } from 'expo-linear-gradient';
import { getUserActiveChallenges, UserChallenge } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

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
            
            // Fetch active challenges from API
            const response = await getUserActiveChallenges();
            
            if (response.success) {
                // Filter challenges by status (case-insensitive comparison)
                const active = response.data.filter(c => 
                    c.status.toUpperCase() === 'ACTIVE');
                const completed = response.data.filter(c => 
                    c.status.toUpperCase() === 'COMPLETED');
                
                setActiveChallenges(active);
                setCompletedChallenges(completed);
            } else {
                setError('Failed to fetch challenges');
            }
        } catch (err) {
            console.error('Error fetching user challenges:', err);
            setError('An error occurred while fetching challenges');
        } finally {
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
                                        { width: `${item.progress * 100}%` }
                                    ]}
                                />
                            </View>
                            <Text style={styles.progressText}>
                                {Math.round(item.progress * 100)}% complete
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    };

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
        </SafeScreenView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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
    tabs: {
        flexDirection: 'row',
        backgroundColor: HomeColors.challengeCard,
        marginTop: 20,
        marginBottom: 10,
        paddingVertical: 10,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: OnboardingColors.accentColor,
    },
    tabText: {
        fontWeight: '500',
        color: HomeColors.textSecondary,
    },
    activeTabText: {
        color: OnboardingColors.accentColor,
    },
    emptyStateContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        marginTop: 40,
    },
    emptyStateIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    emptyStateTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: HomeColors.text,
        marginBottom: 15,
        textAlign: 'center',
    },
    emptyStateDescription: {
        fontSize: 16,
        color: HomeColors.textSecondary,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    joinNowButton: {
        width: '100%',
        borderRadius: 30,
        height: 56,
        overflow: 'hidden',
        shadowColor: OnboardingColors.accentColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    gradientButton: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    joinNowButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    challengesList: {
        flex: 1,
        padding: 15,
    },
    challengeItem: {
        flexDirection: 'row',
        backgroundColor: HomeColors.challengeCard,
        borderRadius: 10,
        marginBottom: 15,
        overflow: 'hidden',
    },
    challengeImageContainer: {
        width: 100,
        height: 100,
    },
    challengeImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    challengeContent: {
        flex: 1,
        padding: 15,
    },
    challengeTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: HomeColors.text,
        marginBottom: 4,
    },
    challengeType: {
        fontSize: 12,
        color: HomeColors.textSecondary,
        marginBottom: 8,
    },
    progressContainer: {
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        marginBottom: 6,
    },
    progressBar: {
        height: 4,
        backgroundColor: OnboardingColors.accentColor,
        borderRadius: 2,
    },
    progressText: {
        fontSize: 12,
        color: HomeColors.textSecondary,
    },
});