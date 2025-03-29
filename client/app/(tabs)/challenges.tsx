import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, HomeColors, OnboardingColors } from '../../constants/Colors';
import { router } from 'expo-router';
import SafeScreenView from '../../components/SafeScreenView';
import { LinearGradient } from 'expo-linear-gradient';

export default function ChallengesScreen() {
    const [activeTab, setActiveTab] = useState('active');
    
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

    return (
        <SafeScreenView style={styles.container} backgroundColor={HomeColors.background} scrollable={true}>
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
});