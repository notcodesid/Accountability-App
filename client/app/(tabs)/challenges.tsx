import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, StatusBar } from 'react-native';
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
}

// Sample data for challenges
const CHALLENGES: Challenge[] = [
    {
        id: '1',
        title: '10K Steps Daily',
        type: 'Steps',
        duration: '30 days',
        progress: 0.75,
        participants: 156,
        contribution: '$50',
        prizePool: '$7,800',
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
    },
];

export default function ChallengesScreen() {
    const [activeTab, setActiveTab] = useState('active');

    const renderChallengeItem = ({ item }: { item: Challenge }) => (
        <TouchableOpacity style={styles.challengeCard} onPress={() => router.push(`/challenges/${item.id}` as any)}>
            <View style={styles.challengeHeader}>
                <View style={styles.challengeBadge}>
                    <Ionicons name={item.type === 'Running' ? 'walk' : (item.type === 'Steps' ? 'footsteps' : 'fitness')} size={20} color="#fff" />
                </View>
                <View style={styles.challengeInfo}>
                    <Text style={styles.challengeTitle}>{item.title}</Text>
                    <Text style={styles.challengeMeta}>{item.type} • {item.duration}</Text>
                </View>
            </View>
            
            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${item.progress * 100}%` }]} />
            </View>
            
            <View style={styles.challengeStats}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{item.participants}</Text>
                    <Text style={styles.statLabel}>Participants</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{item.contribution}</Text>
                    <Text style={styles.statLabel}>Your Stake</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{item.prizePool}</Text>
                    <Text style={styles.statLabel}>Prize Pool</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeScreenView style={styles.container} backgroundColor={HomeColors.background}>
            <StatusBar barStyle="light-content" />
            
            <View style={styles.selectedHeaderContainer}>
                <LinearGradient
                    colors={['rgba(23, 23, 23, 0.9)', 'rgba(10, 10, 10, 0.95)']}
                    style={styles.headerGradient}
                >
                    <View style={styles.selectedHeaderContent}>
                        <Text style={styles.selectedHeaderTitle}>My Challenges</Text>
                        <Text style={styles.selectedHeaderDetails}>Track your progress and earnings</Text>
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
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'created' && styles.activeTab]} 
                    onPress={() => setActiveTab('created')}
                >
                    <Text style={[styles.tabText, activeTab === 'created' && styles.activeTabText]}>Created</Text>
                </TouchableOpacity>
            </View>
            
            <FlatList
                data={CHALLENGES}
                renderItem={renderChallengeItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.challengesList}
            />
            
            <TouchableOpacity 
                style={styles.createButton} 
                onPress={() => router.push('/create-challenge' as any)}
            >
                <Ionicons name="add-circle" size={20} color="#fff" />
                <Text style={styles.createButtonText}>Create Challenge</Text>
            </TouchableOpacity>
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
    },
    challengeCard: {
        backgroundColor: HomeColors.challengeCard,
        borderRadius: 16,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    challengeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    challengeBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: OnboardingColors.accentColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    challengeInfo: {
        flex: 1,
        marginLeft: 12,
    },
    challengeTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: HomeColors.text,
    },
    challengeMeta: {
        fontSize: 12,
        color: HomeColors.textSecondary,
        marginTop: 2,
    },
    progressContainer: {
        height: 6,
        backgroundColor: '#333333',
        borderRadius: 3,
        marginBottom: 15,
    },
    progressBar: {
        height: '100%',
        backgroundColor: OnboardingColors.accentColor,
        borderRadius: 3,
    },
    challengeStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: HomeColors.text,
    },
    statLabel: {
        fontSize: 12,
        color: HomeColors.textSecondary,
        marginTop: 2,
    },
    createButton: {
        flexDirection: 'row',
        backgroundColor: OnboardingColors.accentColor,
        borderRadius: 30,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    createButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
    },
});