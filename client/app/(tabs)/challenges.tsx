import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, StatusBar, ImageBackground, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, HomeColors, OnboardingColors } from '../../constants/Colors';
import { router } from 'expo-router';
import SafeScreenView from '../../components/SafeScreenView';
import { LinearGradient } from 'expo-linear-gradient';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getChallenges, APIChallenge } from '../../services/api';

// Define interface for challenge data as displayed in the UI
interface Challenge {
    id: string;
    title: string;
    type: string;
    duration: string;
    progress: number;
    participants: number;
    contribution: string;
    prizePool: string;
    status?: 'active' | 'completed';
    joined?: boolean;
    image?: string;
    metrics?: string;
    description?: string;
    rules?: string[];
}

export default function ChallengesScreen() {
    const [activeTab, setActiveTab] = useState('active');
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
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
                const transformedChallenges = response.data.map(apiChallenge => transformApiChallenge(apiChallenge));
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
    
    // Transform API challenge data to UI challenge format
    const transformApiChallenge = (apiChallenge: APIChallenge): Challenge => {
        // Set a random progress value for demonstration
        // In a real app, you would get the user's actual progress from the API
        const randomProgress = Math.random();
        const isCompleted = randomProgress >= 1.0;
        
        return {
            id: apiChallenge.id.toString(),
            title: apiChallenge.title,
            type: apiChallenge.type,
            duration: apiChallenge.duration,
            progress: isCompleted ? 1.0 : randomProgress,
            participants: apiChallenge.participantCount,
            contribution: `$${(apiChallenge.userStake / 100).toFixed(0)}`,
            prizePool: `$${(apiChallenge.totalPrizePool / 100).toFixed(0)}`,
            status: isCompleted ? 'completed' : 'active',
            joined: true, // Assume all challenges from API are joined
            image: apiChallenge.image,
            metrics: apiChallenge.metrics,
            description: apiChallenge.description,
            rules: apiChallenge.rules
        };
    };
    
    // Filter challenges based on active tab
    const filteredChallenges = () => {
        switch(activeTab) {
            case 'active':
                return challenges.filter(challenge => challenge.status === 'active' && challenge.joined);
            case 'completed':
                return challenges.filter(challenge => challenge.status === 'completed');
            default:
                return challenges.filter(challenge => challenge.status === 'active' && challenge.joined);
        }
    };

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

    const renderChallengeItem = ({ item }: { item: Challenge }) => (
        <TouchableOpacity 
            style={styles.challengeCard} 
            onPress={() => router.push(`/challenges/${item.id}` as any)}
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
                
                {item.status === 'completed' && (
                    <View style={styles.statusBadge}>
                        <Ionicons name="checkmark-circle" size={16} color="#fff" />
                        <Text style={styles.statusText}>Completed</Text>
                    </View>
                )}
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
                
                {/* Show progress only for joined challenges */}
                {item.joined && (
                    <View style={styles.progressSection}>
                        <View style={styles.progressLabel}>
                            <Text style={styles.progressText}>Progress</Text>
                            <Text style={styles.progressPercentage}>{Math.round(item.progress * 100)}%</Text>
                        </View>
                        <View style={styles.progressContainer}>
                            <View 
                                style={[
                                    styles.progressBar, 
                                    { width: `${item.progress * 100}%` },
                                    item.status === 'completed' ? styles.completedProgressBar : {}
                                ]} 
                            />
                        </View>
                    </View>
                )}
                
                <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                        <Ionicons name="wallet" size={14} color={HomeColors.text} />
                        <Text style={styles.detailText}>Contribution: {item.contribution}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Ionicons name="trophy" size={14} color={HomeColors.text} />
                        <Text style={styles.detailText}>Prize: {item.prizePool}</Text>
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
            <SafeScreenView style={styles.container} backgroundColor={HomeColors.background}>
                <StatusBar barStyle="light-content" />
                <LoadingSpinner message="Loading challenges..." />
            </SafeScreenView>
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
            
            <FlatList
                data={filteredChallenges()}
                renderItem={renderChallengeItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.challengesList}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="alert-circle-outline" size={48} color={HomeColors.textSecondary} />
                        <Text style={styles.emptyText}>No challenges found</Text>
                    </View>
                }
                onRefresh={fetchChallenges}
                refreshing={loading}
            />
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
    challengesList: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    challengeCard: {
        backgroundColor: HomeColors.challengeCard,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
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
        marginBottom: 0,
    },
    challengeTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
    },
    metricsText: {
        fontSize: 14,
        color: '#fff',
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
        fontSize: 12,
        color: HomeColors.textSecondary,
        marginLeft: 5,
    },
    progressSection: {
        marginVertical: 12,
    },
    progressLabel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    progressText: {
        fontSize: 12,
        fontWeight: '600',
        color: HomeColors.text,
    },
    progressPercentage: {
        fontSize: 12,
        fontWeight: 'bold',
        color: OnboardingColors.accentColor,
    },
    progressContainer: {
        height: 6,
        backgroundColor: '#333333',
        borderRadius: 3,
    },
    progressBar: {
        height: '100%',
        backgroundColor: OnboardingColors.accentColor,
        borderRadius: 3,
    },
    completedProgressBar: {
        backgroundColor: '#4CAF50',
    },
    statusBadge: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: '#4CAF50',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        zIndex: 1,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        fontSize: 16,
        color: HomeColors.textSecondary,
        marginTop: 10,
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