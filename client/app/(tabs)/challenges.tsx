import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, StatusBar, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, HomeColors, OnboardingColors } from '../../constants/Colors';
import { router } from 'expo-router';
import SafeScreenView from '../../components/SafeScreenView';
import { LinearGradient } from 'expo-linear-gradient';

// Define interface for challenge data
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
}

// Sample data for challenges
const ALL_CHALLENGES: Challenge[] = [
    {
        id: '1',
        title: '10K Steps Daily',
        type: 'Steps',
        duration: '30 days',
        progress: 0.75,
        participants: 156,
        contribution: '$50',
        prizePool: '$7,800',
        status: 'active',
        joined: true,
        image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1000',
        metrics: '10,000 steps daily'
    },
    {
        id: '2',
        title: '5K Pace Challenge',
        type: 'Running',
        duration: '21 days',
        progress: 0.45,
        participants: 89,
        contribution: '$75',
        prizePool: '$6,675',
        status: 'active',
        joined: true,
        image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=1000',
        metrics: '5 km • 3x week'
    },
    {
        id: '3',
        title: 'Active Minutes',
        type: 'Activity',
        duration: '14 days',
        progress: 0.3,
        participants: 124,
        contribution: '$25',
        prizePool: '$3,100',
        status: 'active',
        joined: true,
        image: 'https://images.unsplash.com/photo-1470299067034-07c696e9ef07?auto=format&fit=crop&w=1000',
        metrics: '60 min • daily'
    },
    {
        id: '4',
        title: 'Morning Meditation',
        type: 'Wellness',
        duration: '60 days',
        progress: 1.0,
        participants: 208,
        contribution: '$30',
        prizePool: '$6,240',
        status: 'completed',
        joined: true,
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000',
        metrics: '10 min • morning'
    },
    {
        id: '5',
        title: 'Water Intake Challenge',
        type: 'Health',
        duration: '14 days',
        progress: 1.0,
        participants: 143,
        contribution: '$20',
        prizePool: '$2,860',
        status: 'completed',
        joined: true,
        image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1000',
        metrics: '2L water • daily'
    },
    {
        id: '6',
        title: 'Book Reading Marathon',
        type: 'Education',
        duration: '30 days',
        progress: 1.0,
        participants: 95,
        contribution: '$40',
        prizePool: '$3,800',
        status: 'completed',
        joined: true,
        image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1000',
        metrics: '30 min • daily'
    },
    {
        id: '7',
        title: 'Plank Challenge',
        type: 'Fitness',
        duration: '30 days',
        progress: 0.15,
        participants: 67,
        contribution: '$35',
        prizePool: '$2,345',
        status: 'active',
        joined: false,
        image: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?auto=format&fit=crop&w=1000',
        metrics: 'increasing daily'
    },
    {
        id: '8',
        title: 'Healthy Meal Prep',
        type: 'Nutrition',
        duration: '21 days',
        progress: 0,
        participants: 112,
        contribution: '$30',
        prizePool: '$3,360',
        status: 'active',
        joined: false,
        image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=1000',
        metrics: '1 meal • daily'
    },
    {
        id: '9',
        title: 'Sleep Tracking',
        type: 'Wellness',
        duration: '14 days',
        progress: 0,
        participants: 85,
        contribution: '$25',
        prizePool: '$2,125',
        status: 'active',
        joined: false,
        image: 'https://images.unsplash.com/photo-1511493485273-992e6069a8d7?auto=format&fit=crop&w=1000',
        metrics: '7+ hours • nightly'
    }
];

export default function ChallengesScreen() {
    const [activeTab, setActiveTab] = useState('active');
    
    // Filter challenges based on active tab
    const filteredChallenges = () => {
        switch(activeTab) {
            case 'active':
                return ALL_CHALLENGES.filter(challenge => challenge.status === 'active' && challenge.joined);
            case 'completed':
                return ALL_CHALLENGES.filter(challenge => challenge.status === 'completed');
            default:
                return ALL_CHALLENGES.filter(challenge => challenge.status === 'active' && challenge.joined);
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
});